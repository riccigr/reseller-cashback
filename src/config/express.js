const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');
//const morgan = require('morgan');
//const logger = require('../lib/logger')

module.exports = () => {
    const app = express();

    // app.use(morgan("common", {
    //     stream:{
    //         write : function(message){
    //             logger.info(message);
    //         }
    //     }
    // }));

    app.use(bodyParser.json());
    app.use(expressValidator());

    console.log('>>>> ' + process.cwd());

    //--TODO review folder structure
    consign({ cwd: process.cwd()})
        .include('src/routes')
        .then('src/services')
        .then('src/database')
        .into(app);

    return app;
};


