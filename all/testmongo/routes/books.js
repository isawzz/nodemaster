const express = require('express');
const router = express.Router()
const Book = require('../models/book');
const Author = require('../models/author');

router.get('/', async (req, res) => {
	let searchOptions = {}
	if (req.query.name){
		searchOptions.name = new RegExp(req.query.name,'i')
	}
	try {
		const books = await Book.find(searchOptions);
		res.render('books/index', { books: books, book: req.query });
	} catch {
		console.log('ERROR!', req.body)
		res.redirect('/');
	}
})
router.get('/new', async (req, res) => {
	try {
		const authors = await Author.find({});
		res.render('books/new', { book: new Book(), authors: authors });
	} catch {
		res.redirect('/books');
	}
})
router.post('/', async (req, res) => {
	const book = new Book({ name: req.body.name });
	try {
		const o = await book.save();
		res.redirect('books'); //res.redirect(`books/${o.id}`); 
	} catch {
		console.log('ERROR!', req.body.name)
		res.render('books/new', { book: book, errorMessage: "error creating book!" })
	}
})

module.exports = router;










