const { execQuietlyAsync } = require("../../process-utils")
const { pythonWise } = require("./util")

async function dodam_dmr2(socket, msg, extra) {
    const { l2, r2 } = msg.data ?? {}
    await execQuietlyAsync(pythonWise('dodam_dcmotorspeed2.py', l2, r2))
}

module.exports = { dodam_dmr2 }
