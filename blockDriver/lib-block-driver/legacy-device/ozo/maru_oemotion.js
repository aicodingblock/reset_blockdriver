const { ozoExec } = require("./ozo-util")

const SOUNDS = [
    'happy1', 'happy2', 'happy3', 'happy4', 'happy5',
    'allright1', 'allright2', 'sad1', 'sad2', 'sad3', 'sad4',
    'surprised1', 'surprised2', 'surprised3', 'surprised4', 'surprised5',
    'laugh1', 'laugh2', 'laugh3', 'laugh4', 'laugh5', 'laugh6',
]

async function maru_oemotion(socket, msg) {
    const { sound = '' } = msg.data ?? {}
    let result = null
    if (SOUNDS.includes(sound)) {
        result = await ozoExec('maru_oemotion', sound)
    }
    return {
        Type: 'maru_oemotion_wait',
        Data: { wait: result }
    }
}

module.exports = { maru_oemotion }
