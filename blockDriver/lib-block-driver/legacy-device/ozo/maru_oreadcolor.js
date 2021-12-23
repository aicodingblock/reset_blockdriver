const { ozoExec } = require("./ozo-util")

async function maru_oreadcolor(socket, msg) {
    const { color } = msg.data ?? {}
    let ret = await ozoExec('maru_oreadcolor', color)
    if (ret === 'True') {
        ret = true
    } else if (ret === 'False') {
        ret = false
    }
    // 이건 왜 이렇게 해놓은건지 모르겠네
    socket.emit('receiveData', { Type: 'maru_oreadcolor_data', Data: { color: ret } })
    socket.emit('receiveData', { Type: 'maru_oreadcolor_wait', Data: { wait: true } })
}

module.exports = { maru_oreadcolor }
