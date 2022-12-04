const express = require('express');
const router = express.Router()
const Author = require('../models/author');

router.get('/', async (req, res) => {
	//v2: (mit search)
	let searchOptions = {}
	if (req.query.name){
		searchOptions.name = new RegExp(req.query.name,'i')
	}
	try {
		const authors = await Author.find(searchOptions);
		res.render('authors/index', { authors: authors, author: req.query });
	} catch {
		console.log('ERROR!', req.body)
		res.redirect('/');
	}

	//v1:
	// try {
	// 	const authors = await Author.find();
	// 	res.render('authors/index', { authors: authors });
	// } catch {
	// 	console.log('ERROR!', req.body)
	// 	res.redirect('/');
	// }

	//v0:
	//res.render('authors/index'); 
})
router.get('/new', (req, res) => {
	res.render('authors/new', { author: new Author() });
})
router.post('/', async (req, res) => {
	const author = new Author({ name: req.body.name });

	//v2 (async):
	try {
		const o = await author.save();
		res.redirect('authors'); //res.redirect(`authors/${o.id}`); 
	} catch {
		console.log('ERROR!', req.body.name)
		res.render('authors/new', { author: author, errorMessage: "error creating author!" })
	}

	//v1:
	// author.save((err, o) => {
	// 	if (err) {
	// 		res.render('authors/new', { author: author, errorMessage: "error creating author!" })
	// 	} else {
	// 		res.redirect('authors'); //res.redirect(`authors/${o.id}`);  
	// 	}
	// })

	//v0:
	//res.send(req.body.name);
})

module.exports = router;










