var constants = require('../helper/constants');
var logger = require('../helper/logger');

const purchase = app => {
  const service = {};
  create(service, app);
  update(service, app);
  return service;
};

// -- Insert a new purchase
const create = (service, app) => {
    service.create = (request, response) => {
        logger.info('create received');

        // -- validate request;
        const invalid = isValidRequest(request)
        if (invalid) {
            logger.info(constants.CLIENT_ERROR_LOG + invalid);
            response.status(422).send({errors:invalid});
            return;
        }
        // -- prepare database connection
        const purchase = request.body['compra'];
        const connection = app.database.connectionFactory();
        const dao = new app.dao.purchaseDAO(connection);
        // -- persist to database
        dao.save(purchase, (err, result) => {
            // -- handle errors
            if (err) {
                logger.info(constants.INTERNAL_ERROR_LOG + err);
               // response.status(500).send({error: 'Não conseguimos incluir a compra.'}); // TODO handle duplicate
                response.status(500).send(err); // TODO handle duplicate
                connection.end();
                return;
            }
            logger.info('SQL Result for create: ' + result);
            connection.end();
            // -- prepare response
            handleResponseCreate(purchase, response);
            logger.info('create end!!!');
        });
    };
}

const update = (service, app) => {
    service.update = (request, response) => {
        logger.info('update received');

        const id = request.params.id;

        // -- validate request;
        const invalid = isValidRequest(request)
        if (invalid) {
            logger.info(constants.CLIENT_ERROR_LOG + invalid);
            response.status(422).send({errors:invalid});
            return;
        }

        // -- search for purchase
        const connection = app.database.connectionFactory();
        const dao = new app.dao.purchaseDAO(connection);

        dao.getById(id, (err, result) => {
            // -- handle errors
            if (err) {
                logger.info(constants.INTERNAL_ERROR_LOG + err);
               // response.status(500).send({error: 'Não conseguimos incluir a compra.'}); // TODO handle duplicate
               connection.end();
                response.status(500).send(err); // TODO handle duplicate
                return;
            }

            if(Object.keys(result).length === 0){
                logger.info('Compra não encontrada: '  + request.params.id);
                connection.end();
                response.status(404).send();
                return;
            }

            logger.info('Compra encontrada: '  + request.params.id);
            // -- prepare database connection
            const changedPurchase = request.body['compra'];

            logger.info(changedPurchase);
    
            // -- persist to database
            dao.update(changedPurchase, id, (err, result) => {
                // -- handle errors
                if (err) {
                    logger.info(constants.INTERNAL_ERROR_LOG + err);
                   // response.status(500).send({error: 'Não conseguimos incluir a compra.'}); // TODO handle duplicate
                    response.status(500).send(err); // TODO handle duplicate
                    connection.end();
                    return;
                }
                logger.info('SQL Result for update: ' + result);
                connection.end();
                // -- prepare response
                handleResponseUpdate(changedPurchase, response);
                logger.info('create end!!!');
            });

        });

        
    };
}

// --check if request has necessary to insert into DB
const isValidRequest = (request) => {
   // request.assert('compra.codigo', 'Codigo é obrigatório').notEmpty(); // TODO check regex and algo
    request.assert('compra.valor', 'Valor é obrigatório').notEmpty(); // TODO check regex and algo
    request.assert('compra.data', 'Data é obrigatória').notEmpty(); // TODO check size
    request.assert('compra.cpf', 'cpf é obrigatório').notEmpty(); // TODO check regex and algo
    const invalid = request.validationErrors();
    console.log(invalid);
    return invalid;
}

const handleResponseCreate = (purchase, response) => {
    response.status(201).json(purchase);
}

const handleResponseUpdate = (purchase, response) => {
    response.status(200).json(purchase);
}


module.exports = app => { return purchase(app);};
