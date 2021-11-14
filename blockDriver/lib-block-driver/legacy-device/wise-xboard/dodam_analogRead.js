const { execShellCommand } = require("../../process-utils")
const { python3Wise } = require("./util")

async function dodam_analogRead(socket, msg, extra) {
    const { data } = msg.data ?? {}
    const result = await execShellCommand(python3Wise('dodam_analogRead.py', data))
    console.log('data = ' + result)
    socket.emit('receiveData', { Type: 'dodam_analogRead_data', Data: { data: result } })
    socket.emit('receiveData', { Type: 'dodam_get_analog_data', Data: { ret: true, data1: -1 } })
}

module.exports = { dodam_analogRead }
