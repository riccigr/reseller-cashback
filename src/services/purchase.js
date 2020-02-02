const constants = require('../helper/constants');
const logger = require('../helper/logger');
const purchaseStatus = require('../helper/status').PurchaseStatus;

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
    const invalid = isValidRequest(request);
    if (invalid) {
      logger.info(constants.CLIENT_ERROR_LOG + invalid);
      response.status(422).send({ errors: invalid });
      return;
    }
    // -- prepare database connection
    const purchase = request.body['compra'];
    const connection = app.database.connectionFactory();
    const dao = new app.dao.purchaseDAO(connection);

    setSpecialConditions(purchase);

    dao.save(purchase, (err, result) => {
      if (err) {
        logger.info(constants.INTERNAL_ERROR_LOG + err);
        // response.status(500).send({error: 'Não conseguimos incluir a compra.'}); // TODO handle duplicate
        response.status(500).send(err); // TODO handle duplicate
        connection.end();
        return;
      }
      logger.info('SQL Result for create: ' + result);
      connection.end();
      
      handleResponseCreate(purchase, response);
      logger.info('create end!!!');
    });
  };
};

const update = async (service, app) => {
  service.update = async (request, response) => {
    logger.info('update received');

    const id = request.params.id;

    // -- validate request;
    const invalid = isValidRequest(request);
    if (invalid) {
      logger.info(constants.CLIENT_ERROR_LOG + invalid);
      response.status(422).send({ errors: invalid });
      return;
    }

    // -- setup database
    const connection = app.database.connectionFactory();
    const dao = new app.dao.purchaseDAO(connection);

    // -- search for purchase async
    const purchase = await findPurchaseById(dao, id)
      .then(rows => {
        return rows[0];
      })

    if (purchase) {      
      logger.info('Compra encontrada: ' + id);
      if (purchase.status !== purchaseStatus.PENDING){
        handleResponsePreconditionFailed(response);
        return;
      }

      const changedPurchase = request.body['compra'];

      dao.update(changedPurchase, id, (err, result) => {
        if (err) {
          logger.info(constants.INTERNAL_ERROR_LOG + err);
          // response.status(500).send({error: 'Não conseguimos incluir a compra.'}); // TODO handle duplicate
          response.status(500).send(err); // TODO handle duplicate
          connection.end();
          return;
        }
        logger.info('SQL Result for update: ' + JSON.stringify(result));
        connection.end();
        
        handleResponseUpdate(changedPurchase, response);
        logger.info('create end!!!');
      });
    } else {
      logger.info('Compra não encontrada: ' + request.params.id);
      connection.end();
      response.status(404).send();
      return;
    }
  };
};

const isValidRequest = request => {
  // request.assert('compra.codigo', 'Codigo é obrigatório').notEmpty(); // TODO check regex and algo
  request.assert('compra.valor', 'Valor é obrigatório').notEmpty(); // TODO check regex and algo
  request.assert('compra.data', 'Data é obrigatória').notEmpty(); // TODO check size
  request.assert('compra.cpf', 'cpf é obrigatório').notEmpty(); // TODO check regex and algo
  const invalid = request.validationErrors();
  console.log(invalid);
  return invalid;
};

const handleResponseCreate = (purchase, response) => {
  response.status(201).json(purchase);
};

const handleResponsePreconditionFailed = (response) => {
    response.status(422).send({'erro': 'O status atual não permite essa operação'});
};

const handleResponseUpdate = (purchase, response) => {
  response.status(200).json(purchase);
};

const findPurchaseById = async (dao, id) => {
  return new Promise(async (resolve, reject) => {
    await dao.getById(id, (err, result) => {
      if (err) {
        logger.info(constants.INTERNAL_ERROR_LOG + err);
        reject();
      }
      resolve(result.length > 0 ? result : undefined);
    });
  });
};

// -- used to set status when cpf is the same proposal
const setSpecialConditions = (purchase) => {
    if (purchase.cpf === '153.509.460-56') {
        purchase.status = purchaseStatus.APPROVED;
    }
}
module.exports = app => {
  return purchase(app);
};

