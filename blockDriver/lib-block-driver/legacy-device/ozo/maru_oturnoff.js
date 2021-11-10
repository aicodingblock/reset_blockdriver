const { ozoExec } = require("./ozo-util")

async function maru_oturnoff(socket) {
    const result = await ozoExec('maru_oturnoff')
    return {
        Type: 'maru_oturnoff_wait',
        Data: { wait: result }
    }
}

module.exports = { maru_oturnoff }
