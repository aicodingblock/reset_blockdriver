const { execQuietlyAsync } = require("../../process-utils")

async function dodam_dma(socket, msg, extra) {
    const { pin, angle, speed } = msg.data ?? {}
    await execQuietlyAsync('python ./dodam_servomotor_angle1.py ', pin, angle, speed)
}

module.exports = { dodam_dma }
