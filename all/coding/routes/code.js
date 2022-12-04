const express = require('express')
const router = express.Router()
const Code = require('../models/code')

// All Codes Route
router.get('/', async (req, res) => {
	let query = Code.find()
	if (req.query.keywords != null && req.query.keywords != '') {
		query = query.regex('keywords', new RegExp(req.query.keywords, 'i'))
	}
	if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
		query = query.lte('createdAt', req.query.publishedBefore)
	}
	if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
		query = query.gte('createdAt', req.query.publishedAfter)
	}
	try {
		const code = await query.exec();
		// console.log('link', code)
		// if (code.link && code.link.RegExp('file')) { code.link = 'http://localhost:8887/' }
		res.render('code/index', {
			code: code,
			searchOptions: req.query
		})
	} catch {
		res.redirect('/')
	}
})

// New Code Route
router.get('/new', async (req, res) => {
	renderNewPage(res, new Code())
})

// Create Code Route
function starts_with(s, sSub) { return s.substring(0, sSub.length) == sSub; }
router.post('/', async (req, res) => {
	const code = new Code({
		keywords: req.body.keywords,
		// link: req.body.link,
		language: req.body.language,
		//createdAt: new Date(req.body.publishDate),
		snippet: req.body.snippet,
		description: req.body.description
	});
	let link = req.body.link;
	console.log('link is', link);
	if (!starts_with(link,'http')) {

		let newlink = 'http://localhost:8887/';
		switch(link){
			case 'nodemaster': newlink = 'http://127.0.0.1:8887/D/a03/nodemaster/'; break;
			case 'aroot': newlink = 'http://localhost:8887/xampp/htdocs/aroot/'; break;
			default: newlink = 'http://127.0.0.1:8887/D/'+link;
		}
		code.link = newlink;
	}
	try {
		const newCode = await code.save()
		res.redirect(`code/${newCode.id}`)
	} catch {
		renderNewPage(res, code, true)
	}
})

// Show Code Route
router.get('/:id', async (req, res) => {
	try {
		const code = await Code.findById(req.params.id)
			//  .populate('author')
			.exec()
		res.render('code/show', { code: code })
	} catch {
		res.redirect('/')
	}
})

// Edit Code Route
router.get('/:id/edit', async (req, res) => {
	try {
		const code = await Code.findById(req.params.id)
		renderEditPage(res, code)
	} catch {
		res.redirect('/')
	}
})

// Update Code Route
router.put('/:id', async (req, res) => {
	let code

	try {
		code = await Code.findById(req.params.id)
		code.keywords = req.body.keywords
		code.author = req.body.author
		code.publishDate = new Date(req.body.publishDate)
		code.pageCount = req.body.pageCount
		code.description = req.body.description
		if (req.body.cover != null && req.body.cover !== '') {
			saveCover(code, req.body.cover)
		}
		await code.save()
		res.redirect(`/code/${code.id}`)
	} catch {
		if (code != null) {
			renderEditPage(res, code, true)
		} else {
			redirect('/')
		}
	}
})

// Delete Code Page
router.delete('/:id', async (req, res) => {
	let code
	try {
		code = await Code.findById(req.params.id)
		await code.remove()
		res.redirect('/code')
	} catch {
		if (code != null) {
			res.render('code/show', {
				code: code,
				errorMessage: 'Could not remove code'
			})
		} else {
			res.redirect('/')
		}
	}
})

async function renderNewPage(res, code, hasError = false) {
	console.log('hallo render new page code')
	renderFormPage(res, code, 'new', hasError)
}

async function renderEditPage(res, code, hasError = false) {
	renderFormPage(res, code, 'edit', hasError)
}

async function renderFormPage(res, code, form, hasError = false) {
	try {
		const params = {
			code: code
		}
		if (hasError) {
			if (form === 'edit') {
				params.errorMessage = 'Error Updating Code'
			} else {
				params.errorMessage = 'Error Creating Code'
			}
		}
		res.render(`code/${form}`, params)
	} catch {
		res.redirect('/code')
	}
}

function saveCover(code, coverEncoded) {
	if (coverEncoded == null) return
	const cover = JSON.parse(coverEncoded)
	if (cover != null && imageMimeTypes.includes(cover.type)) {
		code.coverImage = new Buffer.from(cover.data, 'base64')
		code.coverImageType = cover.type
	}
}

module.exports = router