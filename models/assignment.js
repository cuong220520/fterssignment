const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    }, 
    description: {
        type: String,
        required: false
    },
    document: {
        type: Buffer,
        required: true
    }, 
    documentType: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    grade: {
        type: String,
        required: true
    }
})

assignmentSchema.virtual('documentPath').get(function() {
    if (this.document != null && this.documentType != null) {
        return `data:${this.documentType};charset=utf-8;base64,${this.document.toString('base64')}`
    }
})

module.exports = mongoose.model('Assignment', assignmentSchema)