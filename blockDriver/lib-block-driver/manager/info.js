const { getDeviceModel, getDeviceId, getIp, CODINGPACK_MANAGER_RESPONSE } = require('./util')

async function info(socket, msg) {
    const { requestId } = msg
    const deviceId = await getDeviceId()
    const deviceModel = await getDeviceModel()
    const ip = await getIp()
    return {
        requestId,
        success: true,
        body: {
            deviceId,
            deviceModel,
            ip
        }
    }
}

module.exports = { info }
