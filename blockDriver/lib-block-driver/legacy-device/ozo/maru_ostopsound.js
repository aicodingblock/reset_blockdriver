const { ozoExec } = require("./ozo-util")


async function maru_ostopsound(socket) {
    const result = await ozoExec('maru_ostopsound')
    return {
        Type: 'maru_ostopsound_wait',
        Data: { wait: result }
    }
}

module.exports = { maru_ostopsound }
