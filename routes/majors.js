const express = require('express')
const router = express.Router()

const Major = require('../models/major')
const Course = require('../models/course')

const checkAuthenticated = require('../check-authenticated')

router.get('/', checkAuthenticated, async (req, res) => {
    try {
        const majors = await Major.find({})
        res.render('majors/index', { majors: majors })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id', checkAuthenticated, async (req, res) => {
    try {
        const major = await Major.findById(req.params.id)
        const courses = await Course.find({ major: major.id }).sort({ code: 'desc' })
        res.render('majors/show', { major: major, coursesInMajor: courses })
    } catch {
        res.redirect('/majors')
    }
})

module.exports = router