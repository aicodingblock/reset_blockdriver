const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_omove1(socket, msg) {
    const { ldirection, lspeed, rdirection, rspeed } = msg.data ?? {}
    let result = await ozoExec('maru_omove1', ldirection, lspeed, rdirection, rspeed)
    console.log('result ' + result)
    if (result == 'waiting') {
        OzoStatusChecker.addListener(socket, 'maru_omove1_wait')
    } else {
        return {
            Type: 'maru_omove1_wait',
            Data: { wait: result }
        }
    }
}

module.exports = { maru_omove1 }
