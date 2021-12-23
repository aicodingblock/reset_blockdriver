const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_oflashrainbow(socket, msg) {
    const { count } = msg.data ?? {}
    let result = await ozoExec('maru_oflashrainbow', count)
    if (result == 'waiting') {
        OzoStatusChecker.addListener(socket, 'maru_oflashrainbow_wait')
    } else {
        return {
            Type: 'maru_oflashrainbow_wait',
            Data: { wait: result }
        }
    }
}

module.exports = { maru_oflashrainbow }
