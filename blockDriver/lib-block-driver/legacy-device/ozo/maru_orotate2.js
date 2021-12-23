const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_orotate2(socket, msg) {
    const { direction, rotation } = msg.data ?? {}
    let result = await ozoExec('maru_orotate2', direction, rotation)
    console.log('result ' + result)
    if (result == 'waiting') {
        OzoStatusChecker.addListener(socket, 'maru_orotate2_wait')
    } else {
        return {
            Type: 'maru_orotate2_wait',
            Data: { wait: result }
        }
    }
}

module.exports = { maru_orotate2 }
