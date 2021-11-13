const config = require('../config')
const { controls: HwRegistry } = require('@ktaicoder/hw-control')

const DEBUG = config.debug
const DEVICE_CTL_RESPONSE_V2 = 'deviceCtlMsg_v2:response'
const HW_REGISTRY = {}

const registerHw = (hwId, info, operator, control) => {
    HW_REGISTRY[hwId] = { info, operator, control }
}

Object.entries(HwRegistry).forEach(([hwId, hw]) => {
    console.log({ hw })
    registerHw(hwId, hw.info, hw.operator, hw.control())
})

console.log("=======================")
console.log(HW_REGISTRY)
console.log("------------------------")
function sendError(socket, err) {
    console.log(err)
    if (socket.isOpen) {
        socket.send({ requestId, success: false, error: err.message })
    } else {
        console.log('cannot response, because web socket disconnect')
    }
}

class SerialPortStore {
    // key:hwId, value: SerialPortHelper
    _store = {}

    getOrCreate = (hwId) => {
        let helper = this._store[hwId]
        if (!helper) {
            const { operator } = HW_REGISTRY[hwId]
            helper = operator.createSerialPortHelper('/dev/ttyUSB0')
            this._store[hwId] = helper
            helper.open()
        }
        return helper
    }

    remove = (hwId) => {
        const helper = this._store[hwId]
        if (helper) {
            helper.close()
            delete this._store[hwId]
        }
    }

    removeAll = () => {
        Object.keys(this._store).forEach(hwId => {
            this.remove(hwId)
        })
    }
}

class HwControlManager {
    _serialPortStore = new SerialPortStore()
    // key:hwId, value: HwContext

    closeResources = () => {
        this._serialPortStore.removeAll()
    }

    _ensureSerialPortHelper = async (hwId) => {
        const sp = this._serialPortStore.getOrCreate(hwId)
        if (!sp) {
            console.warn('_createSerialPort fail for hwId = ', hwId)
        } else {
            if (DEBUG) console.warn('_createSerialPort success hwId = ', hwId)
        }

        return sp
    }

    find = async (hwId) => {
        const { control: ctl, info } = HW_REGISTRY[hwId]
        if (!ctl || !info) {
            console.log(`ignore, unknown hardware: ${hwId}`, { requestId, hwId, cmd, args })
            sendError(sock, new Error('unknown hardware:' + hwId))
            return undefined
        }

        if (info.hwKind === 'serial') {
            const sp = await this._ensureSerialPortHelper(hwId)
            ctl._context = {
                provideSerialPortHelper: () => sp
            }
        }
        return ctl
    }
}

class DeviceControllerV2 {
    _controlManager = new HwControlManager()

    closeResources = () => {
        console.log("XXX closeResources() because no clients")
        this._controlManager.closeResources()
    }

    /**
     * @param {*} sock socket.io socket
     * @param {*} message
     * @returns {boolean} 메시지를 처리했으면 true를 리턴
     */
    handle = async (sock, message) => {
        // sock.on('disconnect', () => {
        //     console.log('socket disconnected')
        // })

        const { requestId, clientMeta, hwId, cmd, args } = message
        if (!hwId) {
            sendError(sock, new Error('invalid packet:' + JSON.stringify({ hwId, requestId, cmd })))
            return
        }

        if (!(hwId in HW_REGISTRY)) {
            sendError(sock, new Error('unknown hwId:' + hwId))
            return
        }

        const ctl = await this._controlManager.find(hwId)
        if (!ctl) {
            console.log(`ignore, unknown hardware: ${hwId}`, { requestId, hwId, cmd, args })
            sendError(sock, new Error('unknown hardware:' + hwId))
            return
        }

        const fn = ctl[cmd]
        if (!fn) {
            console.log(`ignore, unknown cmd: ${hwId}.${cmd}`, { requestId, hwId, cmd, args }, ctl)
            sendError(sock, new Error(`unknown cmd: ${hwId}.${cmd}`))
            return
        }

        fn.apply(ctl, args)
            .then((result) => {
                let resultFrame
                if (typeof result === 'undefined' || result === null) {
                    resultFrame = { requestId, success: true }
                } else {
                    resultFrame = { requestId, success: true, body: result }
                }
                sock.emit(DEVICE_CTL_RESPONSE_V2, resultFrame)
            }).catch(err => {
                sendError(sock, err)
            })
    }
}

module.exports = {
    DeviceControllerV2,
    registerHw
}
