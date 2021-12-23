const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_orestnote(socket, msg) {
    const { duration } = msg.data ?? {}
    let result = await ozoExec('maru_orestnote', duration)
    if (result == 'waiting') {
        OzoStatusChecker.addListener(socket, 'maru_orestnote_wait')
    } else {
        return {
            Type: 'maru_orestnote_wait',
            Data: { wait: result }
        }
    }
}


module.exports = { maru_orestnote }
