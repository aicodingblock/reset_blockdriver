const { ozoExec } = require("./ozo-util")

async function maru_oconnect(socket, msg) {
    const { name } = msg.data ?? {}
    let result = await ozoExec('maru_oconnect', name)
    return { Type: 'maru_oconnect_wait', Data: { wait: result } }
}

module.exports = { maru_oconnect }
