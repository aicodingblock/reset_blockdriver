const { execQuietlyAsync } = require("../../../lib-block-driver/process-utils")

async function dodam_dmstop(socket, msg, extra) {
    await execQuietlyAsync('python ./dodam_dcmotorstop.py')
}

module.exports = { dodam_dmstop }
