
const io = require('socket.io-client')


function nextRequestId() {
    return Math.random().toString(36).substring(2);
}

const socket = io('ws://127.0.0.1:3001', {
    autoConnect: true
})

function send(sock) {
    const requestId = nextRequestId()
    socket.emit('deviceCtlMsg_v2', { type: 'led', data: { type: '1', duration: 5 } })
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

