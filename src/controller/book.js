const Mongoose = require('mongoose');
const {AuthorModel, BookModel} = require('../model');

const BookController = {
  index: async (req, res) => {
    let books;

    try {
      books = await BookModel.find().populate('author', 'name photo');
    } catch (e) {
      return res.status(500).json(new Error(e));
    }

    res.status(200).json(books);
  },
  create: async (req, res) => {
    let temp = await BookModel.find({title: req.body.title});
    if (temp.length >= 1) {
      return res.status(409).json(new Error('Book already exist!'));
    }
    console.log(req.link, 'ini link dari cloudinary');
    const book = await new BookModel({
      _id: new Mongoose.Types.ObjectId(),
      title: req.body.title,
      desc: req.body.desc,
      release: req.body.release,
      photo: req.link,
      author: req.author.id,
    });
    await book.save(async function(err, data) {
      if (err) {
        return res.status(500).json(new Error(err));
      }
      const author = await AuthorModel.findOne({_id: req.author.id});
      await author.books.push(data._id);
      await author.save();
    });

    res.status(200).json({message: 'book created'});
  },
  show: async (req, res) => {
    let book;

    try {
      book = await BookModel.findOne({_id: req.params.id}).populate('author');
    } catch (e) {
      return res.status(500).json(new Error(e));
    }

    res.status(200).json(book);
  },
  edit: async (req, res) => {
    let book;
    const temp = await BookModel.findOne({_id: req.params.id});
    if (temp.author != req.author.id) {
      console.log('masuk sini');
      return res
        .status(403)
        .json({message: "Opps you don't have permission for this"});
    }

    if (req.link !== undefined) {
      console.log(req.link, 'masuk sini');
      req.body.photo = req.link;
    }

    try {
      book = await BookModel.findOneAndUpdate({_id: req.params.id}, req.body);
    } catch (e) {
      return res.status(500).json(new Error(e));
    }

    res.status(200).json(book);
  },
  destroy: async (req, res) => {
    const temp = await BookModel.findOne({_id: req.params.id});
    if (temp.author.id !== req.author.id) {
      return res
        .status(403)
        .json({message: "Opps you don't have permission for this"});
    }

    try {
      let [book, author] = await Promise.all([
        BookModel.findOneAndRemove({_id: req.params.id}),
        AuthorModel.findOneAndUpdate(
          {_id: req.author.id},
          {$pull: {books: req.params.id}},
        ),
      ]);
    } catch (e) {
      return res.status(500).json(new Error(e));
    }

    res.status(200).json({message: 'Success removing books'});
  },
};

module.exports = BookController;
