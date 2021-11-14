const { execQuietlyAsync } = require("../../process-utils")
const { pythonWise } = require("./util")

async function dodam_dma(socket, msg, extra) {
    const { pin, angle, speed } = msg.data ?? {}
    await execQuietlyAsync(pythonWise('dodam_servomotor_angle1.py ', pin, angle, speed))
}

module.exports = { dodam_dma }
