const { execQuietlyAsync } = require("../../process-utils")
const { pythonWise } = require("./util")

async function dodam_key(socket, msg, extra) {
    const { key } = msg.data ?? {}
    await execQuietlyAsync(pythonWise('dodam_key.py', key))
}

module.exports = { dodam_key }
