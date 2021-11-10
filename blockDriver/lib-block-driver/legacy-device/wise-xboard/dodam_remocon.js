const { execQuietlyAsync } = require("../../process-utils")

async function dodam_remocon(socket, msg, extra) {
    const result = await execQuietlyAsync('python3 ./dodam_remocon.py 7')
    console.log('data = ' + result)
    return {
        Type: 'dodam_remocon_data',
        Data: { data: result }
    }
}

module.exports = { dodam_remocon }
