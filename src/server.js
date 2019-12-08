require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const mongoose = require('mongoose');
const routes = require('./routes');
const config = require('./config');

const {
  server: { PORT, JWT_SECRET },
} = config;

boostrapApp = () => {
  const app = express();

  if (process.env.ENV !== 'PROD') {
    app.use(morgan('dev'));
  }

  // middlewares
  if (!config.DISABLE_JWT_AUTHORIZATION) {
    app.use(
      jwt({ secret: JWT_SECRET }).unless({
        path: [/\/auth\//],
      })
    );
  }

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());

  // router config
  app.use(`/`, routes);

  return app;
};

const server = {
  start: onStart => {
    const app = boostrapApp();
    mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    app.listen(PORT, () => onStart(PORT));
  },
  boostrapApp,
};

module.exports = server;
