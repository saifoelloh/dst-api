const Jwt = require('jsonwebtoken');
const Bcrypt = require('bcrypt');
const DotEnv = require('dotenv').config();
const Multer = require('multer');
const Cloud = require('cloudinary-direct');
const path = require('path');
const {AuthorModel} = require('../model');

const storage = Multer.diskStorage({
  destination: '../../uploads/',
  filename: async function(req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname),
    );
  },
});
const upload = Multer({
  storage: storage,
  limits: {fileSize: Math.pow(1024, 2) * 1},
}).single('photo');

Cloud.config({
  cloudName: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  upload_preset: process.env.UPLOAD_PRESET,
});

const Middleware = {
  login: async (req, res) => {
    let author = await AuthorModel.find({email: req.body.email});
    if (author.length !== 1) {
      return res.status(400).json({message: 'Auth failed'});
    }

    const result = await Bcrypt.compare(req.body.password, author[0].password);
    if (result) {
      try {
        const payload = {
          id: author[0]._id,
          email: author[0].email,
        };
        const token = await Jwt.sign(payload, process.env.JWT_KEY);
        res.status(200).json({
          message: 'Login success',
          token,
        });
      } catch (e) {
        return res.status(400).json({message: 'Auth failed'});
      }
    } else {
      return res.status(400).json({message: 'Auth failed'});
    }
  },

  check: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const payload = await Jwt.verify(token, process.env.JWT_KEY);
      req.author = payload;
      next();
    } catch (e) {
      return res.status(401).json(new Error(e));
    }
  },
  store: function(req, res, next) {
    upload(req, res, function() {
      Cloud.express.uploadViaMulter(req, function(resp) {
        req.link = resp.url;
        next();
      });
    });
  },
};

module.exports = Middleware;
