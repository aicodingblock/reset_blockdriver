const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_ozigzag(socket, msg) {
    const { count, direct } = msg.data ?? {}
    let result = await ozoExec('maru_ozigzag', count, direct) ?? ''
    result = result.replace(/\n/g, '')
    console.log('result ' + result)
    if (result == 'waiting') {
        console.log('Result waiting...')
        OzoStatusChecker.checkInterval(socket, 'maru_ozigzag_wait')
    } else {
        return {
            Type: 'maru_ozigzag_wait',
            Data: { wait: result }
        }
    }
}

module.exports = { maru_ozigzag }
