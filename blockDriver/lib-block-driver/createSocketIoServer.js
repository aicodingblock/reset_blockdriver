function createSocketIoServer() {
    const io = require('socket.io')({
        cors: {
            origin: '*',
            // methods: ["GET", "POST"]
        },
    })

    return io
}


module.exports = {
    createSocketIoServer
}
