const Mongoose = require('mongoose');

const AuthorSchema = new Mongoose.Schema({
  _id: Mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  state: String,
  photo: String,
  age: Date,
  password: String,
  books: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'book',
    },
  ],
});

const AuthorModel = Mongoose.model('author', AuthorSchema);

module.exports = AuthorModel;
