var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  name: String,
  created_at: Date,
  updated_at: Date
});

var Book = mongoose.model('Book', bookSchema);
module.exports = Book;