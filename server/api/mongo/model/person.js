import { defaultConnection } from '../connection'
import { Schema } from 'mongoose'

var PersonSchema = new Schema({
    name: {
    	type: String,
    	required: true
    },
    email: {
    	type: String,
    	required: true
    },
    created: {
        type: String,
        default: Date.now
    }
})

module.exports = defaultConnection.model('Person', PersonSchema)
