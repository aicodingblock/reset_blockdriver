const { Server } = require('socket.io')
function createSocketIoServer() {
    const io = new Server({
        cors: {
            // origin: ['https://aimk.jjfive.net', 'https://aicodingblock.kt.co.kr'],
            origin: '*',
            methods: ["GET", "POST"]
        },
    })

    return io
}


module.exports = {
    createSocketIoServer
}
