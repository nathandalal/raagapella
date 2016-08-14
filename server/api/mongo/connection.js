import mongoose from 'mongoose'
mongoose.promise = global.Promise //because mpromise is deprecated

import env from '../env'

var connectionObj = null

function initDb(defaultConnectionUrl) {
    if(connectionObj) return connectionObj
    var defaultConn = mongoose.createConnection(defaultConnectionUrl)
	console.log('Mongoose default connection established')

    process.on('SIGINT', () => {
        appDb.close(() => {
            console.log('Mongoose default connection disconnected through app termination')
            process.exit(0)
        })
    })
    return (connectionObj = {defaultConnection:defaultConn})
}

module.exports = initDb(env.MONGO.URL)
