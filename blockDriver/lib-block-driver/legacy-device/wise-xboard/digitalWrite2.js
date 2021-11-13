const { execQuietlyAsync } = require("../../process-utils")

async function digitalWrite2(socket, msg, extra) {
    const { port, data } = msg.data ?? {}
    await execQuietlyAsync('python ./digitalWrite2.py', port, data)
}

module.exports = { digitalWrite2 }
