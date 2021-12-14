const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_orotate1(socket, msg) {
    const { direction, degree } = msg.data ?? {}
    let result = await ozoExec('maru_orotate1', direction, degree) ?? ''
    result = result.replace(/\n/g, '')
    console.log('result ' + result)
    if (result == 'waiting') {
        console.log('Result waiting...')
        OzoStatusChecker.checkInterval(socket, 'maru_orotate1_wait')
    } else {
        return {
            Type: 'maru_orotate1_wait',
            Data: { wait: result }
        }
    }
}

module.exports = { maru_orotate1 }
