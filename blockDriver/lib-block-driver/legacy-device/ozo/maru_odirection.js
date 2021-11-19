const { ozoExec } = require("./ozo-util")

const SOUNDS = ['forward', 'left', 'right', 'back']

async function maru_odirection(socket, msg) {
    const { sound } = msg.data ?? {}
    let result = null
    if (SOUNDS.includes(sound)) {
        result = await ozoExec('maru_odirection', sound)
    }
    return {
        Type: 'maru_odirection_wait',
        Data: { wait: result }
    }
}

module.exports = { maru_odirection }
