const { ozoExec } = require("./ozo-util")

async function maru_oreadcolor(socket, msg) {
    const { color } = msg.data ?? {}
    let ret = await ozoExec('maru_oreadcolor', color) ?? ''
    ret = ret.replace(/\n/g, '')
    if (ret == 'True') {
        ret = true
    } else if (ret == 'False') {
        ret = false
    }
    socket.emit('receiveData', { Type: 'maru_oreadcolor_data', Data: { color: ret } })
    socket.emit('receiveData', { Type: 'maru_oreadcolor_wait', Data: { wait: true } })
}

module.exports = { maru_oreadcolor }
