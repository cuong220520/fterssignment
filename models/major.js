const mongoose = require('mongoose')

const majorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Major', majorSchema)