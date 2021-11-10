const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_orotate2(socket, msg) {
    const { direction, rotation } = msg.data ?? {}
    let result = await ozoExec('maru_orotate2', direction, rotation)
    result = result.replace(/\n/g, '')
    console.log('result ' + result)
    if (result == 'waiting') {
        console.log('Result waiting...')
        OzoStatusChecker.checkInterval(socket, 'maru_orotate2_wait')
    } else {
        return {
            Type: 'maru_orotate2_wait',
            Data: { wait: result }
        }
    }
}

module.exports = { maru_orotate2 }
