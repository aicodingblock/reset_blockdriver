const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_orestnote(socket, msg) {
    const { duration } = msg.data ?? {}
    let result = await ozoExec('maru_orestnote', duration)
    result = result.replace(/\n/g, '')
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
