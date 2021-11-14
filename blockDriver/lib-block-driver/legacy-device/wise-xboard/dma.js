const { execQuietlyAsync } = require("../../process-utils")
const { pythonWise } = require("./util")

async function dma(socket, msg, extra) {
    // 기존에 오타로 통신하고 있었음, angel
    const { pin, angel: angle } = msg.data ?? {}
    await execQuietlyAsync(pythonWise('servomotor_angle.py', pin, angle))
}

module.exports = { dma }
