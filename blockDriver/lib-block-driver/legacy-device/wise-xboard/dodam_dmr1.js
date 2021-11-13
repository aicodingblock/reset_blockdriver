const { execQuietlyAsync } = require("../../process-utils")

async function dodam_dmr1(socket, msg, extra) {
    const { l1, r1 } = msg.data ?? {}
    execQuietlyAsync('python ./dodam_dcmotorspeed1.py', l1, r1)
}

module.exports = { dodam_dmr1 }
