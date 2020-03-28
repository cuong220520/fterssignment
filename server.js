if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')

require('./passport-config')(passport)

const indexRouter = require('./routes/index')
const assignmentRouter = require('./routes/assignments')
const courseRouter = require('./routes/courses')
const loginRouter = require('./routes/login')
const userRouter = require('./routes/users')
const majorRouter = require('./routes/majors')

app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    maxAge: 15 * 60 * 1000
}))
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated()
    next()
})

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/assignments', assignmentRouter)
app.use('/courses', courseRouter)
app.use('/login', loginRouter)
app.use('/users', userRouter)
app.use('/majors', majorRouter)

app.listen(process.env.PORT || 3000)

// localhost:3000/auth/google