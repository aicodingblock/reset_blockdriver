const { execQuietlyAsync } = require("../../process-utils")

async function dodam_digitalWrite(socket, msg, extra) {
    const { pin, data } = msg.data ?? {}
    await execQuietlyAsync('python ./dodam_digitalWrite.py ', pin, data)
}

module.exports = { dodam_digitalWrite }
