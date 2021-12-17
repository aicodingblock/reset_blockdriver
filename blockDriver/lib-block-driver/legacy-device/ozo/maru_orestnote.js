const { OzoStatusChecker, ozoExec, unquote } = require("./ozo-util")

async function maru_orestnote(socket, msg) {
    const { duration } = msg.data ?? {}
    let result = unquote(await ozoExec('maru_orestnote', duration))
    console.log('result ' + result)
    if (result == 'waiting') {
        console.log('Result waiting...')
        OzoStatusChecker.checkInterval(socket, 'maru_orestnote_wait')
    } else {
        return {
            Type: 'maru_orestnote_wait',
            Data: { wait: result }
        }
    }
}


module.exports = { maru_orestnote }
