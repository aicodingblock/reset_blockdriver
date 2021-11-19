const config = require('../config')
const { controls: HwRegistry } = require('@ktaicoder/hw-control')

const DEBUG = config.debug
const VERBOSE = config.verbose
const DEVICE_CTL_RESPONSE_V2 = 'deviceCtlMsg_v2:response'
const HW_REGISTRY = {}

const registerHw = (hwId, info, operator, control) => {
    HW_REGISTRY[hwId] = { info, operator, control }
}

Object.entries(HwRegistry).forEach(([hwId, hw]) => {
    console.log({ hw })
    registerHw(hwId, hw.info, hw.operator, hw.control())
})

if (VERBOSE) {
    console.log("=======================")
    console.log(HW_REGISTRY)
    console.log("------------------------")
}


function sendError(socket, requestId, err) {
    console.log(err)
    if (socket.connected || socket.isOpen) {
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
            return undefined
        }

        if (DEBUG) console.warn('_createSerialPort success hwId = ', hwId)
        return sp
    }

    _injectHwContext = async (hwId, info, ctl) => {
        const ctx = {}
        if (info.hwKind === 'serial') {
            const sp = await this._ensureSerialPortHelper(hwId)
            if (sp) {
                ctx.provideSerialPortHelper = () => sp
            }
        }
        ctl.setContext(ctx)
    }

    find = async (hwId) => {
        const { control: ctl, info } = HW_REGISTRY[hwId]
        if (!ctl || !info) {
            console.log(`ignore, unknown hardware: ${hwId}`)
            return undefined
        }

        this._injectHwContext(hwId, info, ctl)
        return ctl
    }
}

/**
 * 연결 종료 훅
 */
class HwClosingHooks {

    // key={hwid}.{cmd}, value={hwId,cmd,args, debugMsg}
    _hooks = {}

    _runClosingHook = async (params) => {
        const { hwId, cmd, args, debugMsg } = params
        const { control: ctl } = HW_REGISTRY[hwId] ?? {}
        if (ctl && ctl[cmd]) {
            const fn = ctl[cmd]
            try {
                await fn.apply(ctl, args ?? [])
                if (DEBUG) console.log(`closing hook ${hwId}.${cmd}:` + debugMsg)
            } catch (err) {
                console.log(`closing hook fail ${hwId}.${cmd}:` + err.message)
            }
        }
    }

    run = async () => {
        const params = Object.values(this._hooks)
        if (params.length === 0) return
        console.log(`run closing hooks (count = ${params.length})`)
        for (let i = 0; i < params.length; i++) {
            await this._runClosingHook(params[i])
        }

        this._hooks = {}
    }

    check = (hwId, requestCmd) => {
        this._wiseXboard_stopDCMotor(hwId, requestCmd)
        this._wiseXboardPremium_stopDCMotor(hwId, requestCmd)
    }

    _wiseXboard_stopDCMotor = (hwId, requestCmd) => {
        if (hwId !== 'wiseXboard') return
        const isMotorCmd = ['setDCMotorSpeed', 'setServoMotorAngle'].includes(requestCmd)
        if (!isMotorCmd) return
        const cmd = 'stopDCMotor'
        const key = `${hwId}.${cmd}`
        if (!this._hooks[key]) {
            this._hooks[key] = { hwId, cmd, debugMsg: 'DC 모터 정지' }
            if (DEBUG) console.log('add closingHook:', this._hooks[key])
        }
    }

    _wiseXboardPremium_stopDCMotor = (hwId, requestCmd) => {
        if (hwId !== 'wiseXboardPremium') return
        const isMotorCmd = ['setDCMotorSpeedP', 'setDCMotor1SpeedP', 'setDCMotor2SpeedP', 'setServoMotorAngleP'].includes(requestCmd)
        if (!isMotorCmd) return

        const cmd = 'stopDCMotorP'
        const key = `${hwId}.${cmd}`
        if (!this._hooks[key]) {
            this._hooks[key] = { hwId, cmd, debugMsg: 'DC 모터 정지(P)' }
            if (DEBUG) console.log('add closingHook:', this._hooks[key])
        }
    }
}


class DeviceControllerV2 {
    _controlManager = new HwControlManager()
    _closingHooks = new HwClosingHooks()

    closeResources = async () => {
        console.log("XXX closeResources() because no clients")
        await this._closingHooks.run()
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
            sendError(sock, requestId, new Error('invalid packet:' + JSON.stringify({ hwId, requestId, cmd })))
            return
        }

        if (!(hwId in HW_REGISTRY)) {
            sendError(sock, requestId, new Error('unknown hwId:' + hwId))
            return
        }

        const ctl = await this._controlManager.find(hwId)
        if (!ctl) {
            console.log(`ignore, unknown hardware: ${hwId}`, { requestId, hwId, cmd, args })
            sendError(sock, requestId, new Error('unknown hardware:' + hwId))
            return
        }

        const fn = ctl[cmd]
        if (!fn) {
            console.log(`ignore, unknown cmd: ${hwId}.${cmd}`, { requestId, hwId, cmd, args }, ctl)
            sendError(sock, requestId, new Error(`unknown cmd: ${hwId}.${cmd}`))
            return
        }

        this._closingHooks.check(hwId, cmd)
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
                sendError(sock, requestId, err)
            })
    }
}

module.exports = {
    DeviceControllerV2,
    registerHw
}
