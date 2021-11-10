const { execQuietlyAsync } = require("../../../lib-block-driver/process-utils")

async function dmr(socket, msg, extra) {
    const { l1, r1, l2, r2 } = msg.data ?? {}
    await execQuietlyAsync('python ./dcmotorspeed.py', l1, r1, l2, r2)
}

module.exports = { dmr }
