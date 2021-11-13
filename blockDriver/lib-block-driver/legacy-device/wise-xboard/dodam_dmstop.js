const { execQuietlyAsync } = require("../../process-utils")

async function dodam_dmstop(socket, msg, extra) {
    await execQuietlyAsync('python ./dodam_dcmotorstop.py')
}

module.exports = { dodam_dmstop }
