const express = require('express')
const router = express.Router()

const Course = require('../models/course')
const Assignment = require('../models/assignment')
const Major = require('../models/major')

const checkAuthenticated = require('../check-authenticated')

router.get('/', checkAuthenticated, async (req, res) => {
    let searchOptions = {}

    if (req.query.name != null && req.query.name != '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }

    if (req.query.code != null && req.query.code != '') {
        searchOptions.code = new RegExp(req.query.code, 'i')
    }

    try {
        const courses = await Course.find(searchOptions)
        res.render('courses/index', {
            courses: courses,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/courses')
    }

    // let courses
    // try {
    //     courses = await Course.find().sort({ code: 'desc' })
    // } catch {
    //     courses = []
    // }
    // res.render('courses/index', { courses: courses })
})

router.get('/new', checkAuthenticated, (req, res) => {
    renderNewPage(res, new Course())
})

router.post('/', checkAuthenticated, async (req, res) => {
    const course = new Course({
        name: req.body.name,
        code: req.body.code,
        major: req.body.major
    })
    try {
        const newCourse = await course.save()
        res.redirect(`/courses/${newCourse.id}`)
    } catch {
        renderNewPage(res, course, true)
    }
})

router.get('/:id', checkAuthenticated, async(req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        const assignments = await Assignment.find({ course: course.id })
        res.render('courses/show', { course: course, assignmentsByUser: assignments })
    } catch {
        res.redirect('/courses')
    }
})

router.get('/:id/edit', checkAuthenticated, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        renderEditPage(res, course)
    } catch {
        res.redirect('/courses')
    }
})

router.put('/:id', checkAuthenticated, async(req, res) => {
    let course 
    try {
        course = await Course.findById(req.params.id)
        course.name = req.body.name
        course.code = req.body.code
        course.major = req.body.major
        await course.save()
        res.redirect(`/courses/${course.id}`)
    } catch {
        renderEditPage(res, course, true)
    }
})

router.delete('/:id', checkAuthenticated, async(req, res) => {
    let course
    try {
        course = await Course.findById(req.params.id)
        await course.remove()
        res.redirect('/courses')
    } catch {
        res.render('courses/show', {
            course: course,
            errorMessage: 'Deleting course error!'
        })
    }
})

function renderNewPage(res, course, hasError = false) {
    renderFormPage(res, course, 'new', hasError)
}

function renderEditPage(res, course, hasError = false) {
    renderFormPage(res, course, 'edit', hasError)
}

async function renderFormPage(res, course, form, hasError = false) {
    try {
        const majors = await Major.find({})

        const params = {
            course: course,
            majors: majors
        }
        if (hasError) {
            if (form == 'edit') {
                params.errorMessage = 'Updating course error!'
            } else {
                params.errorMessage = 'Creating course error!'
            }
        }
        res.render(`courses/${form}`, params)
    } catch {
        res.redirect('/courses')
    }
}

module.exports = router