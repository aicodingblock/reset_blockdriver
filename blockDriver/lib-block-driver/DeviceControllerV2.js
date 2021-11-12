const config = require('../config')
const { controls: HwRegistry } = require('@aimk/hw-control')

const DEBUG = config.debug

const HW_REGISTRY = {}

const registerHw = (hwId, info, operator, control) => {
    HW_REGISTRY[hwId] = { info, operator, control }
}

Object.entries(HwRegistry).forEach(([hwId, hw]) => {
    console.log({ hw })
    registerHw(hwId, hw.info, hw.operator, hw.control())
})

function sendError(socket, err) {
    console.log(err)
    if (socket.isOpen) {
        socket.send({ type: 'channel', channel: requestId, success: false, error: err.message })
    } else {
        console.log('cannot response, because web socket disconnect')
    }
}

class DeviceControllerV2 {
    _serialPorts = {}

    _createSerialPort = (hwId) => {
        const { control: ctl, info, operator } = HW_REGISTRY[hwId]
        return operator.createSerialPort('/dev/ttyUSB0')
    }

    _ensureSerialPort = async (hwId) => {
        let sp = this._serialPorts[hwId]
        if (!sp) {
            sp = this._createSerialPort(hwId)
            if (!sp) {
                console.warn('_createSerialPort fail for hwId = ', hwId)
            } else {
                if (DEBUG) console.warn('_createSerialPort success hwId = ', hwId)
            }
            this._serialPorts = {}
            this._serialPorts[hwId] = sp
        }

        return sp
    }

    /**
     * @param {*} socket socket.io socket
     * @param {*} message
     * @returns {boolean} 메시지를 처리했으면 true를 리턴
     */
    handle = async (socket, message) => {
        socket.on('disconnect', () => {
            console.log('socket disconnected')
        })

        const { requestId, clientMeta, hwId, cmd, args } = message
        const { control: ctl, info, operator } = HW_REGISTRY[hwId]
        if (!ctl || !info) {
            console.log(`ignore, unknown hardware: ${hwId}`, { requestId, hwId, cmd, args })
            return
        }

        // const list = await SerialPort.list()
        // console.log('serial port list = ', list)
        // console.log('info = ', info)
        if (info.hwKind === 'serial') {
            await this._ensureSerialPort(hwId)
            ctl.serialPort = this._serialPorts[hwId]
        }

        const fn = ctl[cmd]
        fn.apply(ctl, args)
            .then((result) => {
                let resultFrame
                if (typeof result === 'undefined' || result === null) {
                    resultFrame = { type: 'channel', channel: requestId, success: true }
                } else {
                    resultFrame = { type: 'channel', channel: requestId, success: true, body: result }
                }
                socket.emit('deviceCtlMsg_v2:response', resultFrame)
            }).catch(err => {
                sendError(sock, err)
            })
    }
}

module.exports = {
    DeviceControllerV2,
    registerHw
}
