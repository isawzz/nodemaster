// if (process.env.NODE_ENV !== 'production') { require('dotenv').load() }

const express = require('express')
const app = express()
// const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

// app.set('view engine', 'ejs')
// app.set('views', __dirname + '/views')
// app.set('layout', 'layouts/layout')
// app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('..'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const { DATABASE_URL, PORT } = require('../conf');
// const DATABASE_URL = 'mongodb+srv://admin:PGJpyMmWw0Npmd2e@cluster0.vuq6gro.mongodb.net/?retryWrites=true&w=majority';
const mongoose = require('mongoose')
mongoose.connect(DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen(3000)