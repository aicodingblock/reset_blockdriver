const http = require('http')
const fs = require('fs')
const { spawn, exec } = require('child_process')
const gpio = require('rpi-gpio')
const { program } = require('commander')
const sensor = require('node-dht-sensor')

const { execQuietlyAsync } = require('./lib-block-driver/process-utils')
const { createWebServer } = require('./lib-block-driver/createWebServer')
const { createLegacyDeviceController } = require('./lib-block-driver/createLegacyDeviceController')

const programArg = program
    .version('0.1')
    .option('-a,--autorun', 'from Autorun')
    .parse(process.argv)

if (!programArg.autorun) {
    //if not autorun kill python button_trigger_4share3.py
    exec('sudo systemctl stop aimk_auto')
} else {
    console.log('disable stop python')
}


let hasKey = false

//기본 GPIO 설정
gpio.setup(29, gpio.DIR_IN, gpio.EDGE_BOTH) //버튼 핀은 입력으로

gpio.on('change', function (channel, value) {
    //29번 핀에 변화가 있는 경우
    if (channel === 29 && value === false) {
        //console.log("Button Clicked!");
        io.sockets.emit('receiveData', {
            Type: 'ktaimk_button_push',
            Data: { ret: true },
        })
        //return;
    }

    if (typeof value === 'boolean') {
        console.log(`Boolean Type Vaule --- gpio Read Pin:${channel} Value:${value}`)
    } else if (typeof value === 'number') {
        console.log(`Number Type Value gpio Read Pin:${channel} Value:${value}`)
        value = value.toString()
    } else if (typeof value === 'string') {
        console.log(` String Type Vaule --- gpio Read Pin:${channel} Value:${value}`)
    } else if (value === null) {
        console.log(`gpio Read Data Empty..... --- gpio Read Pin:${channel} Value:${value}`)
    } else {
        console.log(`NaN Type Value --- gpio Read Pin:${channel} Value:${value}`)
    }

    io.sockets.emit('receiveData', { Type: 'ktaimk_gpio_data', Data: { pin: channel, value } })
})

const io = require('socket.io')(3001, {
})

execQuietlyAsync('sudo python3 ./ozo_server.py')
execQuietlyAsync('cd /home/pi/pi-blaster/ && sudo ./pi-blaster')

const legacyDeviceController = createLegacyDeviceController()
legacyDeviceController.setGpio(gpio)
legacyDeviceController.setSensor(sensor)
io.sockets.on('connection', function (socket) {
    console.log('connect success')

    legacyDeviceController.setSocket(socket)
    legacyDeviceController.setGpio(gpio)
    legacyDeviceController.setSensor(sensor)

    if (hasKey == false) {
        socket.emit('noHasDevKey')
    } else {
        socket.emit('hasDevKey')
    }

    socket.on('kill', function () {
        console.log('kill driver')
        socket.emit('die')
        process.exit()
    })

    socket.on('reboot', function () {
        setTimeout(function () {
            process.on('exit', function () {
                spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached: true,
                    stdio: 'inherit',
                })
            })
            process.exit()
        }, 1000)
    })

    socket.on('deviceCtlMsg', async function (msg) {
        console.log('deviceCtlMsg', msg)
        const handled = legacyDeviceController.handle(socket, msg)
        if (!handled) {
            msg_executor(socket, msg)
        }
    })
})


async function msg_executor(socket, msg) {
    if (msg.type == 'ktaimk_gpio_data') {
        console.log('gpio read:' + pin)
    }
}

// for devkey
const uploadDir = __dirname + '/key/'
const app = createWebServer({ uploadDir })
http.createServer(app).listen(3002, function () {
    console.log('http server start')
})

