const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    major: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Major'
    }
})

module.exports = mongoose.model('Course', courseSchema)