const { execQuietlyAsync } = require("../../process-utils")
const { pythonWise } = require("./util")

async function setHumanoidMotion(socket, msg, extra) {
    const { data } = msg.data ?? {}
    await execQuietlyAsync(pythonWise('setHumanoidMotion.py ', data))
}

module.exports = { setHumanoidMotion }
