var constants = require('../helper/constants');
var logger = require('../helper/logger');

const reseller = app => {
  const service = {};
  create(service, app);
  return service;
};

// -- Insert a new reseller
const create = (service, app) => {
    service.create = (request, response) => {
        // -- validate request;
        if (isValidRequest(request)) {
            logger.info(constants.CLIENT_ERROR_LOG + invalid);
            response.status(422).send({errors:invalid});
            return;
        }
        // -- prepare database connection
        const reseller = request.body['revendedor'];
        const connection = app.database.connectionFactory();
        const dao = new app.dao.resellerDAO(connection);
        // -- persist to database
        dao.save(reseller, (err, result) => {
            // -- handle errors
            if (err) {
                logger.info(constants.INTERNAL_ERROR_LOG + err);
                response.status(500).send({error: 'Não conseguimos incluir o revendedor.'}); // TODO handle duplicate
                connection.end();
                return;
            }
            connection.end();
            // -- prepare response
            handleResponse(reseller, response);
        });
    };
}

// --check if request has necessary to insert into DB
const isValidRequest = (request) => {
    request.assert('revendedor.cpf', 'CPF é obrigatório').notEmpty(); // TODO check regex and algo
    request.assert('revendedor.nome', 'Nome é obrigatório').notEmpty(); // TODO check size
    request.assert('revendedor.email', 'E-mail é obrigatório').notEmpty().isEmail(); // TODO check size
    request.assert('revendedor.senha', 'Senha é obrigatória').notEmpty(); // set hash
    const invalid = request.validationErrors();
    return invalid;
}

const handleResponse = (reseller, response) => {
    delete reseller.senha;
    response.status(201).json(reseller);
}


module.exports = app => { return reseller(app);};
