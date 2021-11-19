const config = require('../config')
const { controls: HwRegistry } = require('@ktaicoder/hw-control')
const DEBUG = config.debug
const VERBOSE = config.verbose
const DEVICE_CTL_RESPONSE_V2 = 'deviceCtlMsg_v2:response'
const HW_REGISTRY = {}

const registerHw = (hwId, info, operator, controlFactory) => {
    console.log('register hw:' + hwId)
    HW_REGISTRY[hwId] = { info, operator, controlFactory }
}

Object.entries(HwRegistry).forEach(([hwId, hw]) => {
    registerHw(hwId, hw.info, hw.operator, hw.control)
})

function createHw(hwId) {
    const hw = HwRegistry[hwId]
    return {
        hwId,
        info: hw.info,
        operator: hw.operator,
        ctl: hw.control()
    }
}

if (VERBOSE) {
    console.log("=======================")
    console.log(Object.keys(HW_REGISTRY))
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


class SerialPortHolder {
    constructor(hwId) {
        const { operator } = HW_REGISTRY[hwId]
        const helper = operator.createSerialPortHelper('/dev/ttyUSB0')
        this.hwId = hwId
        this.helper = helper
        helper?.open()
    }

    getSerialPortHelper = () => {
        return this.helper
    }

    destroy = () => {
        const helper = this.helper
        if (helper) {
            console.log('serial port close for:' + this.hwId)
            helper.destroy()
        }
    }
}


class HwControlManager {
    closeResources = () => {
    }

    _ensureSerialPortHolder = async (hwId) => {
        const holder = new SerialPortHolder(hwId)
        const sp = holder.getSerialPortHelper()
        if (!sp) {
            console.warn('_ensureSerialPortHelper() _createSerialPort fail for hwId = ', hwId)
            return undefined
        }
        try {
            await sp.waitUntilOpen()
            if (DEBUG) console.warn('_ensureSerialPortHelper() _createSerialPort success hwId = ', hwId)
            return holder
        } catch (err) {
            return undefined
        }
    }

    _injectHwContext = async (hwId, info, ctl) => {
        const ctx = {}
        let serialPortHolder = undefined
        if (info.hwKind === 'serial') {
            serialPortHolder = await this._ensureSerialPortHolder(hwId)
            const helper = serialPortHolder.getSerialPortHelper()
            if (helper) {
                ctx.provideSerialPortHelper = () => helper
            }
        }
        ctl.setContext(ctx)
        return serialPortHolder
    }

    find = async (hwId) => {
        const { ctl, info, operator } = createHw(hwId)
        if (!ctl || !info) {
            console.log(`ignore, unknown hardware: ${hwId}`)
            return {}
        }

        const serialPortHolder = await this._injectHwContext(hwId, info, ctl)
        return { ctl, info, operator, serialPortHolder }
    }
}

/**
 * 연결 종료 훅
 */
class HwClosingHooks {
    constructor(ctlmgr) {
        this._controlManager = ctlmgr
    }

    // key={hwid}.{cmd}, value={hwId,cmd,args, debugMsg}
    _hooks = {}

    _runClosingHook = async (params) => {
        const { hwId, cmd, args, debugMsg } = params
        const { ctl, serialPortHolder } = await this._controlManager.find(hwId)

        try {
            if (!ctl) {
                console.log('XXX _runClosingHook cannot find hwid=', hwId)
                return
            }

            if (ctl && ctl[cmd]) {
                const fn = ctl[cmd]
                try {
                    await fn.apply(ctl, args ?? [])
                    if (DEBUG) console.log(`closing hook ${hwId}.${cmd}:` + debugMsg)
                } catch (err) {
                    console.log(`closing hook fail ${hwId}.${cmd}:` + err.message)
                }
            }
        } finally {
            serialPortHolder?.destroy()
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
    _closingHooks = new HwClosingHooks(this._controlManager)

    closeResources = async () => {
        console.log("closeResources() because no clients")
        try {
            await this._closingHooks.run()
        } catch (ignore) {
        }
        this._controlManager.closeResources()
    }

    /**
     * @param {*} sock socket.io socket
     * @param {*} message
     * @returns {boolean} 메시지를 처리했으면 true를 리턴
     */
    handle = async (sock, message) => {
        const { requestId, clientMeta, hwId, cmd, args } = message
        if (!hwId) {
            sendError(sock, requestId, new Error('invalid packet:' + JSON.stringify({ hwId, requestId, cmd })))
            return
        }

        if (!(hwId in HW_REGISTRY)) {
            sendError(sock, requestId, new Error('unknown hwId:' + hwId))
            return
        }

        const { ctl, info, operator, serialPortHolder } = await this._controlManager.find(hwId)
        if (!ctl) {
            console.log(`ignore, unknown hardware: ${hwId}`, { requestId, hwId, cmd, args })
            serialPortHolder?.destroy(hwId)
            sendError(sock, requestId, new Error('unknown hardware:' + hwId))
            return
        }

        const fn = ctl[cmd]
        if (!fn) {
            console.log(`ignore, unknown cmd: ${hwId}.${cmd}`, { requestId, hwId, cmd, args }, ctl)
            serialPortHolder?.destroy(hwId)
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
                serialPortHolder?.destroy(hwId)
                sock.emit(DEVICE_CTL_RESPONSE_V2, resultFrame)
            }).catch(err => {
                serialPortHolder?.destroy(hwId)
                sendError(sock, requestId, err)
            }).finally(() => {

            })
    }
}

module.exports = {
    DeviceControllerV2,
    registerHw
}
