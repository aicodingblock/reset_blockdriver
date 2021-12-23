const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_ogentone2(socket, msg) {
    const { octno, tone, duration } = msg.data ?? {}
    let result = await ozoExec('maru_ogentone2', octno, tone, duration)
    if (result == 'waiting') {
        OzoStatusChecker.addListener(socket, 'maru_ogentone2_wait')
    } else {
        return {
            Type: 'maru_ogentone2_wait',
            Data: { wait: result }
        }
    }
}


module.exports = { maru_ogentone2 }
