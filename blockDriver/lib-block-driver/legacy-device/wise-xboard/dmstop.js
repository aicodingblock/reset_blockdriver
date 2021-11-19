const { execQuietlyAsync } = require("../../process-utils")
const { pythonWise } = require("./util")

async function dmstop(socket, msg, extra) {
    await execQuietlyAsync(pythonWise('dcmotorstop.py'))
    await execQuietlyAsync(pythonWise('dodam_dcmotorstop.py'))
}

module.exports = { dmstop }
