const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_oflashrainbow(socket, msg) {
    const { count } = msg.data ?? {}
    let result = await ozoExec('maru_oflashrainbow', count)
    result = result.replace(/\n/g, '')
    console.log('result ' + result)
    if (result == 'waiting') {
        console.log('Result waiting...')
        OzoStatusChecker.checkInterval(socket, 'maru_oflashrainbow_wait')
    } else {
        return {
            Type: 'maru_oflashrainbow_wait',
            Data: { wait: result }
        }
    }
}

module.exports = { maru_oflashrainbow }
