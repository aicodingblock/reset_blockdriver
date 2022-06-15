const cors = {
    origin: [
        'https://aicodingblock.kt.co.kr',
        'https://aicodiny.com',
    ],
    methods: ["GET", "POST"]
}

module.exports = {
    // debug: process.env.NODE_ENV === "development"
    debug: false,
    verbose: false,
    cors
}
