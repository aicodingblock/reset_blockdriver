const { ozoExec } = require("./ozo-util");

async function maru_onumber(socket, msg) {
    const { sound } = msg.data ?? {}
    const soundNum = +sound
    let result = null;
    // soundNum = [0..10]
    if (!isNaN(soundNum) && soundNum >= 0 && soundNum <= 10) {
        result = await ozoExec("maru_onumber", soundNum);
    }

    return {
        Type: "maru_onumber_wait",
        Data: { wait: result },
    };
}

module.exports = { maru_onumber };
