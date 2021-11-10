const { ozoExec } = require("./ozo-util");

async function maru_otopled1(socket, msg) {
    const { rgb } = msg.data ?? {}
    const [r, g, b] = rgb
    const result = await ozoExec("maru_otopled1", r, g, b)
    return {
        Type: "maru_otopled1_wait",
        Data: { wait: result },
    };
}

module.exports = { maru_otopled1 };
