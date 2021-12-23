const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_odance(socket) {
    let result = await ozoExec('maru_odance')
    if (result == 'waiting') {
        OzoStatusChecker.addListener(socket, 'maru_odance_wait')
    } else {
        return {
            Type: 'maru_odance_wait',
            Data: { wait: result }
        }
    }
}

module.exports = { maru_odance }
