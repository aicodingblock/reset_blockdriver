const io = require('socket.io-client')

function nextRequestId() {
    return Math.random().toString(36).substring(2);
}

const socket = io('ws://127.0.0.1:3001', {
    autoConnect: true
})

function send(sock) {
    const requestId = nextRequestId()
    sock.on('disconnect', () => {
        console.log('XXX sock instance disconnect')
    })

    sock.on('deviceCtlMsg_v2:response', (frame) => {
        const { requestId: channelId, body, success } = frame
        if (frame.requestId === channelId) {
            console.log('response ok, deviceCtlMsg_v2:response', frame)
        } else {
            console.log('response ignore, deviceCtlMsg_v2:response', frame)
        }
    })

    sock.emit('deviceCtlMsg_v2', {
        requestId,
        clientMeta: 'normal',
        hwId: 'wise-xboard',
        cmd: 'digitalWrite',
        args: [1, 1]
    })
}

socket.on('connect', () => {
    console.log('connect')

    send(socket)
})

socket.on('disconnect', () => {
    console.log('disconnect')
})

socket.on('receiveData', (msg) => {
    console.log('receiveData', msg)
})
