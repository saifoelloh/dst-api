const Mongoose = require('mongoose');

const BookSchema = new Mongoose.Schema({
  _id: Mongoose.Schema.Types.ObjectId,
  photo: String,
  title: String,
  desc: String,
  release: Date,
  author: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'author',
    required: true,
  },
});

const BookModel = Mongoose.model('book', BookSchema);

module.exports = BookModel;
