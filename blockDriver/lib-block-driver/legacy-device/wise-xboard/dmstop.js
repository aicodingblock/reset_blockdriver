const { execQuietlyAsync } = require("../../../lib-block-driver/process-utils")

async function dmstop(socket, msg, extra) {
    await execQuietlyAsync('python ./dcmotorstop.py')
    await execQuietlyAsync('python ./dodam_dcmotorstop.py')
}

module.exports = { dmstop }
