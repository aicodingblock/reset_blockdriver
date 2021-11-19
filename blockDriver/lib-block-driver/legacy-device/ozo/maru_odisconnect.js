const { ozoExec } = require("./ozo-util")

async function maru_odisconnect(socket) {
    const result = await ozoExec('maru_odisconnect')
    return {
        Type: 'maru_odisconnect_wait',
        Data: { wait: result }
    }
}

module.exports = { maru_odisconnect }
