const { OzoStatusChecker, ozoExec } = require("./ozo-util")


async function maru_omove3(socket, msg) {
    const { distance, speed } = msg.data ?? {}
    let result = await ozoExec('maru_omove3', distance, speed)
    console.log('result ' + result)
    if (result == 'waiting') {
        OzoStatusChecker.addListener(socket, 'maru_omove3_wait')
    } else {
        return {
            Type: 'maru_omove3_wait',
            Data: { wait: result }
        }
    }
}


module.exports = { maru_omove3 }
