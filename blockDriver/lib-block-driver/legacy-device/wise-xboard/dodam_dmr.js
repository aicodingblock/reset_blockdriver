const { execQuietlyAsync } = require("../../../lib-block-driver/process-utils")

async function dodam_dmr(socket, msg, extra) {
    const { l1, r1, l2, r2 } = msg.data ?? {}
    await execQuietlyAsync('python ./dodam_dcmotorspeed.py', l1, r1, l2, r2)
}

module.exports = { dodam_dmr }
