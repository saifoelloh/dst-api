const Express = require('express');
const Mongoose = require('mongoose');
const BodyParser = require('body-parser');
const DotEnv = require('dotenv').config();
const Multer = require('multer');
const Cors = require('cors');

const app = Express();
const PORT = process.env.PORT | 3000;

Mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${
    process.env.DB_PASS
  }@pet-shop-hmtxn.gcp.mongodb.net/test?retryWrites=true`,
);

app.use(Cors());
app.use(BodyParser.json());

const {AuthRoute, AuthorRoute, BookRoute} = require('./src/route');
app
  .use('/api/auth/', AuthRoute)
  .use('/api/author/', AuthorRoute)
  .use('/api/book/', BookRoute);

app.use(function(req, res) {
  res.status(404).json({message: 'api route not found'});
});

app.listen(PORT, () => {
  console.log(`Your app running on port ${PORT}`);
});
