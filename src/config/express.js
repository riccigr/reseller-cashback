const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

module.exports = () => {
    const app = express();

    app.use(bodyParser.json());
    app.use(expressValidator());

    consign({cwd: 'src'})
        .include('services')
        .then('database')
        .then('routes')
        .then('dao')
        .into(app);

    return app;
};


