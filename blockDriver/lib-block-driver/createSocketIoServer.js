const { Server } = require('socket.io')
function createSocketIoServer() {
    const io = new Server({
        cors: {
            origin: ['https://aicodingblock.kt.co.kr'],
            // origin: '*', // 이건 안된다
            methods: ["GET", "POST"]
        },
    })

    return io
}


module.exports = {
    createSocketIoServer
}
