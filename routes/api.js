/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const {ObjectId, ObjectID} = require('mongodb');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  commentcount: Number,
  comments: [String]
})

let Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  app.use(bodyParser.urlencoded({extended: false}))

  app.route('/api/books')
    .get(async function (req, res){
      res.send(
        await Book.find({}, {__v: 0, comments: 0})
      )
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      let title = req.body.title;

      if (!title) {
        return res.send('missing required field title')
      };

      const newBook = new Book({
        title: title,
        commentcount: 0,
        comments: []
      })

      await newBook.save();


      res.send(
        await Book.findById(newBook._id, {commentcount: 0, comments: 0, __v: 0})
      );

      //response will contain new book object including atleast _id and title
    })
    
    .delete(async function(req, res){

      await Book.deleteMany({});

      res.send('complete delete successful');
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;

      if (!ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }

      const bookData = await Book.findById(bookid, {commentcount: 0, __v: 0});

      if (!bookData) {
        return res.send('no book exists');
      }

      res.send(bookData);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send('missing required field comment');
      }

      if (!ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }

      const bookData = await Book.findByIdAndUpdate(bookid, {$push: {comments: comment}, $inc: {commentcount: 1}});

      if (!bookData) {
        return res.send('no book exists');
      }

      const updatedBook = await Book.findById(bookid, {__v: 0, commentcount: 0});

      res.send(updatedBook);


      //json res format same as .get
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;

      if (!ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }

      const deletedBook = await Book.findByIdAndDelete(bookid);
      if (!deletedBook) {
        return res.send('no book exists');
      }

      res.send('delete successful');
      //if successful response will be 'delete successful'
    });
  
};
