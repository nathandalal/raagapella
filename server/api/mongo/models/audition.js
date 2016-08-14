import { defaultConnection } from '../connection'
import mongoose, { Schema } from 'mongoose'

var Audition = new mongoose.Schema({
    starttime: { //unix timestamp
    	type: Number,
    	required: true
    }
    endtime: {
    	type: Number,
    	required: true
    }
})

module.exports = defaultConnection.model('Metric', MetricSchema)
