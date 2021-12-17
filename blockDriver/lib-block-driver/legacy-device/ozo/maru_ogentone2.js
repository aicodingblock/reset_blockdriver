const { OzoStatusChecker, ozoExec, unquote } = require("./ozo-util")

async function maru_ogentone2(socket, msg) {
    const { octno, tone, duration } = msg.data ?? {}
    let result = unquote(await ozoExec('maru_ogentone2', octno, tone, duration))
    console.log('result ' + result)
    if (result == 'waiting') {
        console.log('Result waiting...')
        OzoStatusChecker.checkInterval(socket, 'maru_ogentone2_wait')
    } else {
        return {
            Type: 'maru_ogentone2_wait',
            Data: { wait: result }
        }
    }
}


module.exports = { maru_ogentone2 }
