const Bcrypt = require('bcrypt');
const Mongoose = require('mongoose');
const {AuthorModel} = require('../model');

const AuthorController = {
  index: async (req, res) => {
    let user;
    try {
      user = await AuthorModel.findOne({_id: req.author.id}).populate('books');
    } catch (e) {
      return res.status(500).json(new Error(e));
    }

    res.status(200).json(user);
  },
  create: async (req, res) => {
    const temp = AuthorModel.find({name: req.body.name});
    if (temp.length !== 0) {
      return res.status(409).json(new Error('Author already exist'));
    }

    await Bcrypt.hash(req.body.password, 10, async (err, hash) => {
      let photo;
      if (err) {
        return res.status(500).json(new Error(err));
      }

      if (req.link != undefined) {
        photo = req.link;
      } else {
        photo = '';
      }

      const author = await new AuthorModel({
        _id: new Mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        photo: photo,
        password: hash,
        age: req.body.age,
        books: [],
      });

      await author.save();
      res.status(201).json({
        message: 'Success created author',
        author,
      });
    });
  },
  show: async (req, res) => {
    let author;
    try {
      author = await AuthorModel.findOne({_id: req.params.id}).populate(
        'books',
      );
    } catch (e) {
      return res.status(204).json(new Error(e));
    }

    res.status(200).json(author);
  },
  edit: async (req, res) => {
    let author;
    const temp = await AuthorModel.findOne({_id: req.params.id});
    if (temp._id != req.author.id) {
      return res
        .status(403)
        .json({message: "Opps you don't have permission for this"});
    }

    if (req.link !== undefined) {
      req.body.photo = req.link;
    }

    try {
      Bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json(new Error(err));
        }
        await AuthorModel.findOneAndUpdate(
          {_id: req.params.id},
          {
            name: req.body.name,
            email: req.body.email,
            photo: req.body.photo,
            password: hash,
            age: req.body.age,
            books: req.body.books,
          },
        ).then((resp) => {
          res.status(202).json({message: 'Success updating your profile'});
        });
      });
    } catch (e) {
      return res.status(500).json(new Error(e));
    }
  },
  destroy: async (req, res) => {
    let author;

    try {
      author = await AuthorModel.findOneAndRemove({_id: req.params.id});
    } catch (e) {
      return res.status(500).json(new Error(e));
    }

    res.status(200).json({
      message: 'Success remove an author',
    });
  },
  list: async (req, res) => {
    let users;
    try {
      users = await AuthorModel.find().populate('books', 'title photo');
    } catch (e) {
      return res.status(500).json(new Error(e));
    }

    res.status(200).json(users);
  },
};

module.exports = AuthorController;
