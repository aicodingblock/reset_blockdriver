const config = require('../config')
const DEBUG = config.debug

class LegacyDeviceController {
    _registry = {}

    _socket = undefined
    _gpio = undefined
    _sensor = undefined

    constructor() {
    }

    setSocket(socket) { this._socket = socket }
    setGpio(gpio) { this._gpio = gpio }
    setSensor(sensor) { this._sensor = sensor }

    /**
     * 메시지 핸들러 등록 여부
     * @param {!string} msgType 메시지 타입
     * @returns {boolean} 등록된 경우 true
     */
    isRegistered = (msgType) => {
        return typeof this._registry[msgType] !== 'undefined'
    }

    /**
     * 핸들러 등록
     * @param {!string} msgType 메시지 타입
     * @param {*} handlerFn
     */
    add = (msgType, handlerFn) => {
        if (DEBUG) {
            if (this.isRegistered(msgType)) {
                console.warn(`already registered msgType='${msgType}'`)
                throw new Error(`already registered msgType='${msgType}'`)
            }
        }
        this._registry[msgType] = handlerFn
    }

    /**
     *
     * @param {*} message
     * @returns {boolean} 메시지를 처리했으면 true를 리턴
     */
    handle = async (message) => {
        const sock = this._socket
        if (!sock) {
            console.info('websocket is null')
            return false
        }

        const type = message.type
        if (typeof type !== 'string') {
            console.warn('unknown message:', message)
            return false
        }

        const handlerFn = this._registry[type]
        if (!handlerFn) {
            console.debug('message handle not registered:' + type)
            return false
        }

        try {
            const extra = { gpio: this._gpio, sensor: this._sensor }
            const responseData = await handlerFn(sock, message, extra)
            if (responseData) {
                sock.emit('receiveData', responseData)
            }
        } catch (err) {
            // 에러 처리는 핸들러에서 해야 한다
            console.warn('error occured:', err)
        }
        return true
    }
}

module.exports = {
    LegacyDeviceController,
}
