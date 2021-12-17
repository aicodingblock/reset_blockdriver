const { OzoStatusChecker, ozoExec, unquote } = require("./ozo-util")


async function maru_omove3(socket, msg) {
    const { distance, speed } = msg.data ?? {}
    let result = unquote(await ozoExec('maru_omove3', distance, speed))
    console.log('result ' + result)
    if (result == 'waiting') {
        console.log('Result waiting...')
        OzoStatusChecker.checkInterval(socket, 'maru_omove3_wait')
    } else {
        return {
            Type: 'maru_omove3_wait',
            Data: { wait: result }
        }
    }
}


module.exports = { maru_omove3 }
