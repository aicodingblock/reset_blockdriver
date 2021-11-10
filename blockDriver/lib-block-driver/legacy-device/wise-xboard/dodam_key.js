const { execQuietlyAsync } = require("../../../lib-block-driver/process-utils")

async function dodam_key(socket, msg, extra) {
    const { key } = msg.data ?? {}
    await execQuietlyAsync('python ./dodam_key.py', key)
}

module.exports = { dodam_key }
