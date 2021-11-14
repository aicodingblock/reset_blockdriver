const http = require('http')
const { spawn, exec } = require('child_process')
const gpio = require('rpi-gpio')
const { program } = require('commander')
const sensor = require('node-dht-sensor')
const lodash = require('lodash')

const { execQuietlyAsync } = require('./lib-block-driver/process-utils')
const { createWebServer } = require('./lib-block-driver/createWebServer')
const { createLegacyDeviceController } = require('./lib-block-driver/createLegacyDeviceController')
const { DeviceControllerV2 } = require('./lib-block-driver/DeviceControllerV2')
const { createSocketIoServer } = require('./lib-block-driver/createSocketIoServer')

const DEVICE_CTL_REQUEST_V2 = 'deviceCtlMsg_v2:request'
const DEVICE_CTL_RESPONSE_V2 = 'deviceCtlMsg_v2:response'

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

const io = createSocketIoServer()

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

// pi-blaster process kill
function killPiBlaster() {
    return execQuietlyAsync(`sudo pkill pi-blaster`)
}

// ozo server process kill
function killOzoServer() {
    return execQuietlyAsync(`ps -ef | grep "python3 ./ozo_server" | grep -v grep | awk '{print $2}' | xargs sudo kill -9 2> /dev/null`)
}

// restart pi-blaster
killPiBlaster().finally(() => execQuietlyAsync('cd /home/pi/pi-blaster/ && sudo ./pi-blaster'))

// restart ozo-server
killOzoServer().finally(() => execQuietlyAsync('sudo python3 ./ozo_server.py'))

// 레거시 디바이스 제어 핸들러
const legacyDeviceController = createLegacyDeviceController()
legacyDeviceController.setGpio(gpio)
legacyDeviceController.setSensor(sensor)

// V2 디바이스 제어 핸들러
const deviceControllerV2 = new DeviceControllerV2()

const clientSockets = {}
io.on('connection', function (socket) {
    console.log('connect success', socket.id, 'totalClients=', lodash.keys(clientSockets).length)

    if (clientSockets[socket.id]) {
        console.log('already connected', socket.id)
        return
    }

    console.log('new connection', socket.id)
    clientSockets[socket.id] = socket

    socket.on('disconnect', async function (reason) {
        console.log('on disconnect', reason)
        delete clientSockets[socket.id]

        // 접속자가 없을때 리소스를 닫는다
        if (Object.keys(clientSockets).length === 0) {
            deviceControllerV2.closeResources()
        }
    })


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

    // V2 디바이스 제어 핸들러
    socket.on(DEVICE_CTL_REQUEST_V2, async function (msg) {
        console.log(DEVICE_CTL_REQUEST_V2, msg)
        deviceControllerV2.handle(socket, msg)
    })

    // 레거시 디바이스 제어 핸들러
    socket.on('deviceCtlMsg', async function (msg) {
        console.log('deviceCtlMsg', msg)
        const handled = legacyDeviceController.handle(socket, msg)
        if (!handled) {
            msg_executor(socket, msg)
        }
    })
})

io.on('disconnect', function (arg) {
    console.log('on disconnect', arg)
})

async function msg_executor(socket, msg) {
    if (msg.type == 'ktaimk_gpio_data') {
        console.log('gpio read:' + pin)
    }
}

// socket io server start
io.listen(3001)

// for devkey
const uploadDir = __dirname + '/key/'
const app = createWebServer({ uploadDir })
http.createServer(app).listen(3002, function () {
    console.log('http server start')
})

process.on('beforeExit', () => {
    killPiBlaster()
    killOzoServer()
})
