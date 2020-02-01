var constants = require('../helper/constants');
var logger = require('../helper/logger');

const reseller = app => {
  const service = {};

  create(service, app);

  return service;
};



const create = (service, app) => {
    service.create = (request, response) => {
        // -- validate request;
        if (isValidRequest(request)) {
            logger.info(constants.CLIENT_ERROR_LOG + invalid);
            response.status(400).send(invalid);
            return;
        }
        // -- prepare database connection
        const reseller = request.body['reseller'];
        const connection = app.database.connectionFactory();
        const dao = new app.dao.resellerDAO(connection);
        // -- persist to database
        dao.save(reseller, (err, result) => {
            // -- handle errors
            if (err) {
                logger.info(constants.INTERNAL_ERROR_LOG + err);
                response.status(500).send(constants.INTERNAL_ERROR_MSG);
                connection.end();
                return;
            }
            connection.end();
            // -- prepare response
            handleResponse(reseller, result, connection, response);
        });
    };
}

// --check if request has necessary to insert into DB
const isValidRequest = (request) => {
    request.assert('reseller.full_name', 'Full name is mandatory').notEmpty();
    request.assert('reseller.cpf', 'CPF is mandatory').notEmpty();
    request.assert('reseller.email', 'E-mail is mandatory').notEmpty();
    request.assert('reseller.password', 'Password is mandatory').notEmpty();
    const invalid = request.validationErrors();
    return invalid;
}

const handleResponse = (reseller, result, connection, response) => {
    reseller.id = result.insertId;
    response.location('/reseller/' + reseller.id);
    response.status(201).json(reseller);
}


module.exports = app => {
    return reseller(app);
  };
