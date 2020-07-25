const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const morgan = require('morgan');
const logger = require('../helper/logger');

module.exports = () => {
  const app = express();

  app.use(
    morgan('common', {
      stream: {
        write(message) {
          logger.info(message);
        }
      }
    })
  );

  app.use(bodyParser.json());
  app.use(expressValidator());

  consign({
    cwd: 'src'
  })
    .include('database')
    .then('dao')
    .then('services')
    .then('routes')
    .into(app);

  return app;
};
