const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_orotate1(socket, msg) {
    const { direction, degree } = msg.data ?? {}
    let result = await ozoExec('maru_orotate1', direction, degree)
    if (result == 'waiting') {
        OzoStatusChecker.addListener(socket, 'maru_orotate1_wait')
    } else {
        return {
            Type: 'maru_orotate1_wait',
            Data: { wait: result }
        }
    }
}

module.exports = { maru_orotate1 }
