function createSocketIoServer() {
    const io = require('socket.io')({
        cors: {
            origin: 'http://localhost:3000',
            methods: ["GET", "POST"]
        },
    })

    return io
}


module.exports = {
    createSocketIoServer
}
