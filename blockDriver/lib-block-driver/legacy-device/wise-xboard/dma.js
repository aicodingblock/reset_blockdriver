const { execQuietlyAsync } = require("../../../lib-block-driver/process-utils")

async function dma(socket, msg, extra) {
    // 기존에 오타로 통신하고 있었음, angel
    const { pin, angel: angle } = msg.data ?? {}
    await execQuietlyAsync('python ./servomotor_angle.py ', pin, angle)
}

module.exports = { dma }
