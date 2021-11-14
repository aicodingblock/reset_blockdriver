const { execShellCommand } = require("../../process-utils")
const { pythonWise } = require("./util")

async function digitalRead(socket, msg, extra) {
    const { data } = msg.data ?? {}

    const result = await execShellCommand(pythonWise('digitalRead.py', data))
    return {
        Type: 'ktaimk_get_digitalRead',
        Data: { ret: true, data: result }
    }
}

module.exports = { digitalRead }
