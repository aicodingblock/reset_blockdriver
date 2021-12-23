const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_omove2(socket, msg) {
    const { direction, distance, speed } = msg.data ?? {}
    let result = await ozoExec('maru_omove2', direction, distance, speed)
    console.log('result ' + result)
    if (result === 'waiting') {
        OzoStatusChecker.addListener(socket, 'maru_omove2_wait')
    } else {
        return {
            Type: 'maru_omove2_wait',
            Data: { wait: result }
        }
    }
}


module.exports = { maru_omove2 }
