const config = require('../config')
const DEBUG = config.debug
const manager = require('./manager')
const { CODINGPACK_MANAGER_RESPONSE } = require('./manager/util')

class CodingpackManagerController {
    _registry = {}

    constructor() {
    }

    /**
     *
     * @param {*} sock socket.io socket
     * @param {*} message
     * @returns {boolean} 메시지를 처리했으면 true를 리턴
     */
    handle = async (sock, message) => {
        const cmd = message.cmd
        if (typeof cmd !== 'string') {
            console.warn('unknown message:', message)
            return false
        }
        const requestId = message.requestId
        const handlerFn = manager[cmd]
        if (!handlerFn) {
            console.debug('message handle not registered:' + cmd)
            return false
        }

        try {
            const responseData = await handlerFn(sock, message)
            if (responseData) {
                sock.emit(CODINGPACK_MANAGER_RESPONSE, responseData)
            }
        } catch (err) {
            console.warn('error occured:', err)
            sock.emit(CODINGPACK_MANAGER_RESPONSE, {
                requestId,
                success: false,
                error: err.message
            })
        }
        return true
    }
}

module.exports = {
    CodingpackManagerController,
}
