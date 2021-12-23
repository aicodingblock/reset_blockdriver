const { ozoExec } = require("./ozo-util")


async function maru_oobstacle(socket, msg) {
    const { pos } = msg.data ?? {}
    let ret = await ozoExec('maru_oobstacle', pos)
    // if (ret == 'False') {
    //     ret = false
    // } else {
    //     ret = true
    // }
    console.log('maru_oobstacle_data ' + ret)
    // socket.emit('receiveData', { Type: 'maru_oobstacle_data', Data: { obstacle: ret } })
    // socket.emit('receiveData', { Type: 'maru_oobstacle_wait', Data: { wait: true } })
    return {
        Type: 'maru_oobstacle_data',
        Data: { obstacle: ret }
    }
}

module.exports = { maru_oobstacle }
