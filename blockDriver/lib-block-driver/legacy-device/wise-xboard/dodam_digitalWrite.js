const { execQuietlyAsync } = require("../../process-utils")
const { pythonWise } = require("./util")

async function dodam_digitalWrite(socket, msg, extra) {
    const { pin, data } = msg.data ?? {}
    await execQuietlyAsync(pythonWise('dodam_digitalWrite.py', pin, data))
}

module.exports = { dodam_digitalWrite }
