const { Server } = require('socket.io')
const { cors } = require('../config')

function createSocketIoServer() {
    const io = new Server({ cors })
    return io
}


module.exports = {
    createSocketIoServer
}
