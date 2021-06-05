const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();
const router = require('./routes/index');
const handleErrors = require('./middlewares/handleErrors');

const { PORT = 3000 } = process.env;

mongoose.connect(process.env.NODE_ENV === 'production'
  ? process.env.DB
  : 'mongodb://localhost:27017/devdb',
{
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();

app.use(cors({
  origin: [
    'https://biyele.nomoredomains.club',
    'http://biyele.nomoredomains.club',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('PORT is:', PORT);
});
