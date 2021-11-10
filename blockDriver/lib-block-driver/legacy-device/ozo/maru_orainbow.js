const { ozoExec } = require("./ozo-util")

async function maru_orainbow(socket) {
    const result = await ozoExec('maru_orainbow')
    return {
        Type: 'maru_orainbow_wait',
        Data: { wait: result }
    }
}

module.exports = { maru_orainbow }
