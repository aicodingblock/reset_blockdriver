const { ozoExec } = require("./ozo-util")

const SOUNDS = ['red', 'green', 'yellow', 'blue', 'cyan', 'white', 'black']

async function maru_ocolor(socket, msg) {
    const { sound } = msg.data ?? {}
    let result = null
    if (SOUNDS.includes(sound)) {
        result = await ozoExec('maru_ocolor', sound)
    }
    return {
        Type: 'maru_ocolor_wait',
        Data: { wait: result }
    }
}

module.exports = { maru_ocolor }
