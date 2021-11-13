const { execQuietlyAsync } = require("../../process-utils")

async function setHumanoidMotion(socket, msg, extra) {
    const { data } = msg.data ?? {}
    await execQuietlyAsync('python ./setHumanoidMotion.py ', data)
}

module.exports = { setHumanoidMotion }
