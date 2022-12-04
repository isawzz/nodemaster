
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const authorsRouter = require('./routes/authors')
const booksRouter = require('./routes/books')

const cors = require('cors');
app.use(cors());

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('..'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

const { DATABASE_URL, PORT } = require('../conf')
const mongoose = require('mongoose')
mongoose.connect(DATABASE_URL, {})
const db = mongoose.connection
db.on('error', x => console.log(x))
db.once('open', () => console.log('connected to mongoose'))

app.use('/', indexRouter);
app.use('/authors', authorsRouter); //NOTE: path is composed together with paths in ./routes/authors.js
app.use('/books', booksRouter); 

app.listen(PORT)










