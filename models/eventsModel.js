const mongoose =require('mongoose')

const Schema = mongoose.Schema

const eventsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required:true
    },
    type: {
        type: String,
        required: true

        //TODO
        //Limit type choices to ones we define here
    }
})

module.exports.eventsModel = mongoose.model('Events', eventsSchema, 'events')

module.exports.eventsSchema = eventsSchema