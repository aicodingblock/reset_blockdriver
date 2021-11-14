const { execQuietlyAsync } = require("../../process-utils")
const { pythonWise } = require("./util")

async function dodam_dmr1(socket, msg, extra) {
    const { l1, r1 } = msg.data ?? {}
    await execQuietlyAsync(pythonWise('dodam_dcmotorspeed1.py', l1, r1))
}

module.exports = { dodam_dmr1 }
