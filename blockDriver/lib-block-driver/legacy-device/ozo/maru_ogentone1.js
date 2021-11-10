const { ozoExec } = require("./ozo-util")

async function maru_ogentone1(socket, msg) {
    const { octno, tone } = msg.data ?? {}
    const result = await ozoExec('maru_ogentone1', octno, tone)
    return {
        Type: 'maru_ogentone1_wait',
        Data: { wait: result }
    }
}
module.exports = { maru_ogentone1 }
