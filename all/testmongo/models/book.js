const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
	//v0:
  coverImageName: {
    type: String,
    required: true
  },
	//v1:
  // coverImage: {
  //   type: Buffer,
  //   required: true
  // },
  // coverImageType: {
  //   type: String,
  //   required: true
  // },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author' //matches modes/authors.js export type!!!
  }
})

module.exports = mongoose.model('Book',bookSchema); //exports a class Book (~table)












