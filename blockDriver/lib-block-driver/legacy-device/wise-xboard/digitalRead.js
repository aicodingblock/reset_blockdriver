const { execShellCommand } = require("../../process-utils")

async function digitalRead(socket, msg, extra) {
    const { data } = msg.data ?? {}
    const result = await execShellCommand('python ./digitalRead.py', data)
    return {
        Type: 'ktaimk_get_digitalRead',
        Data: { ret: true, data: result }
    }
}

module.exports = { digitalRead }
