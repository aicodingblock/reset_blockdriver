module.exports = {
    ...require('./bh1750'),
    ...require('./getDHT11_Humidity'),
    ...require('./getDHT11_Temp'),
    ...require('./gpioMode'),
    ...require('./gpioWrite'),
    ...require('./led'),
    ...require('./setServo'),
}