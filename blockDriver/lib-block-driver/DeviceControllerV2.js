const config = require('../config')
const SerialPort = require('serialport')
const {
    
} = require('@aimk/hw-proto')

const DEBUG = config.debug

const _registry = {}

class DeviceControllerV2 {
    _serialPorts = {}

    _createSerialPort = (hwId) => {
        const { control: ctl, info, operator } = _registry[hwId]
        return operator.createSerialPort('/dev/ttyUSB0')
    }

    _ensureSerialPort = async (hwId) => {
        if (typeof this._serialPort[hwId] === 'undefined') {
            const sp = this._createSerialPort(hwId)
            this._serialPorts = {}
            this._serialPorts[hwId] = sp
        }

        return this._serialPorts[hwId]
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
        const { control: ctl, info, operator } = _registry[hwId]
        if (!ctl || !info) {
            console.log(`ignore, unknown hardware: ${hwId}`, { requestId, hwId, cmd, args })
            return
        }

        if (info.hwKind === 'serial') {
            await this._ensureSerialPort()
            ctl.seriapPort = this._serialPorts[hwId]
        }

        const fn = ctl[cmd]
        fn.apply(ctl, args).then((result) => {
            let resultFrame
            if (typeof result === 'undefined' || result === null) {
                resuleFrame = { type: 'channel', channel: requestId, success: true }
            } else {
                resuleFrame = { type: 'channel', channel: requestId, success: true, body: result }
            }
            socket.emit(resultFrame)
        })
    }
}
module.exports = {
    DeviceControllerV2
}