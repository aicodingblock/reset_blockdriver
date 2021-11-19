const { spawn } = require('child_process')
const gpio = require('rpi-gpio')
const sensor = require('node-dht-sensor')
const { createLegacyDeviceController } = require('./createLegacyDeviceController')
const { DeviceControllerV2 } = require('./DeviceControllerV2')
const { broadcastGpioEvent } = require('./broadcastGpioEvent')

const config = require('../config')
const DEBUG = config.debug

const DEVICE_CTL_REQUEST_V1 = 'deviceCtlMsg'
const DEVICE_CTL_REQUEST_V2 = 'deviceCtlMsg_v2:request'
const DEVICE_CTL_RESPONSE_V2 = 'deviceCtlMsg_v2:response'

let hasKey = false

// 레거시 디바이스 제어 핸들러
const legacyDeviceController = createLegacyDeviceController()
legacyDeviceController.setGpio(gpio)
legacyDeviceController.setSensor(sensor)

// V2 디바이스 제어 핸들러
const deviceControllerV2 = new DeviceControllerV2()


/**
 * socket.io 서버가 준비되었을때 호출되는 함수
 * GPIO event를 브로드캐스트한다
 */
function onReadyWebSocketServer(io) {
    broadcastGpioEvent(io, gpio)
}

// 클라이언트 소켓 모음
const clientSockets = {}

function onNewClient(socket) {

    if (DEBUG) {
        console.log('new connection', socket.id, 'totalClients=', Object.keys(clientSockets).length)
    } else {
        console.log('new connection', socket.id)
    }


    if (clientSockets[socket.id]) {
        // 이런 경우는 없음
        console.log('already connected', socket.id)
        return
    }

    clientSockets[socket.id] = socket

    legacyDeviceController.setGpio(gpio)
    legacyDeviceController.setSensor(sensor)
    if (hasKey == false) {
        socket.emit('noHasDevKey')
    } else {
        socket.emit('hasDevKey')
    }

    // 레거시 디바이스 제어 핸들러
    const onMessageV1 = async (msg) => {
        console.log('deviceCtlMsg', msg)
        try {
            const handled = await legacyDeviceController.handle(socket, msg)
            if (!handled) {
                msg_executor(socket, msg)
            }
        } catch (err) {
            console.log('handle deviceCtlMsg fail:', err.message)
        }
    }


    // V2 디바이스 제어 핸들러
    const onMessageV2 = async (msg) => {
        console.log(DEVICE_CTL_REQUEST_V2, msg)
        try {
            await deviceControllerV2.handle(socket, msg)
        } catch (err) {
            console.log(`handle ${DEVICE_CTL_REQUEST_V2} fail:`, err.message)
        }
    }

    // 재부팅
    const onReboot = () => {
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
    }

    // KILL
    const onKill = () => {
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
    }


    socket.on(DEVICE_CTL_REQUEST_V1, onMessageV1)
    socket.on(DEVICE_CTL_REQUEST_V2, onMessageV2)
    socket.on('kill', onKill)
    socket.on('reboot', onReboot)
    socket.once('disconnect', async function (reason) {
        console.log('on disconnect', reason)
        delete clientSockets[socket.id]

        socket.off(DEVICE_CTL_REQUEST_V1, onMessageV1)
        socket.off(DEVICE_CTL_REQUEST_V2, onMessageV2)
        socket.off('kill', onKill)
        socket.off('reboot', onReboot)

        // 접속자가 없을때 리소스를 닫는다
        if (Object.keys(clientSockets).length === 0) {
            deviceControllerV2.closeResources()
        }
    })
}


function msg_executor(socket, msg) {
    if (msg.type == 'ktaimk_gpio_data') {
        console.log('gpio read:' + pin)
    }
}

module.exports = {
    onNewClient,
    onReadyWebSocketServer
}
