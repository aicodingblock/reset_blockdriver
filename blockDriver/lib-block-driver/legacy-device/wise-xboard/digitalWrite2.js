const { execQuietlyAsync } = require("../../process-utils")
const { pythonWise } = require("./util")

async function digitalWrite2(socket, msg, extra) {
    const { port, data } = msg.data ?? {}
    await execQuietlyAsync(pythonWise('digitalWrite2.py', port, data))
}

module.exports = { digitalWrite2 }
