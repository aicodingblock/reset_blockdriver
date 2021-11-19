const { ozoExec } = require("./ozo-util")

async function maru_ofrontledoff(socket) {
    const result = await ozoExec('maru_ofrontledoff')
    return {
        Type: 'maru_ofrontledoff_wait',
        Data: { wait: result }
    }
}

module.exports = { maru_ofrontledoff }
