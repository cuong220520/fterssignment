const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    shared: {
        type: Number,
        required: true
    },
    downloaded: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)