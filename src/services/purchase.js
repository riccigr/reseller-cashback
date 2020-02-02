const constants = require('../helper/constants');
const logger = require('../helper/logger');
const purchaseStatus = require('../helper/status').PurchaseStatus;
const handleHttp = require('../helper/handleHttpResponse').handleHttp;

const purchase = app => {
  const service = {};
  const connection = app.database.connectionFactory();
  const dao = new app.dao.purchaseDAO(connection);
  create(service, dao);
  update(service, app);
  remove(service, app);
  return service;
};

// -- Insert a new purchase
const create = async (service, dao) => {
  service.create = async (request, response) => {
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

    setStatus(purchase);
    setCashback(purchase);

    saveIntoDatabase(dao, purchase, response)
      .then(() => {
        handleHttp.Create(purchase, response);
      })
      .catch((err) => {
        if (err.code === 'ER_DUP_ENTRY'){
          handleHttp.Duplicate(response);
        }
        handleHttp.InternalError(response);
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
    const purchase = await findPurchaseById(dao, id).then(rows => {
      return rows[0];
    });

    if (purchase) {
      logger.info('Compra encontrada: ' + id);
      if (purchase.status !== purchaseStatus.PENDING) {
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

const remove = async (service, app) => {
  service.remove = async (request, response) => {
    logger.info('delete received');

    const id = request.params.id;

    // -- setup database
    const connection = app.database.connectionFactory();
    const dao = new app.dao.purchaseDAO(connection);

    // -- search for purchase async
    const purchase = await findPurchaseById(dao, id).then(rows => {
      return rows;
    });

    if (purchase) {
      logger.info('Compra encontrada: ' + id);
      if (purchase.status !== purchaseStatus.PENDING) {
        handleResponsePreconditionFailed(response);
        return;
      }
      dao.remove(id, (err, result) => {
        if (err) {
          logger.info(constants.INTERNAL_ERROR_LOG + err);
          // response.status(500).send({error: 'Não conseguimos incluir a compra.'}); // TODO handle duplicate
          response.status(500).send(err); // TODO handle duplicate
          connection.end();
          return;
        }
        logger.info('SQL Result for delete: ' + JSON.stringify(result));
        connection.end();

        handleResponseNoContent(response);
        logger.info('delete end!!!');
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
  return invalid;
};

const findPurchaseById = async (dao, id) => {
  return new Promise(async (resolve, reject) => {
    await dao.getById(id, (err, result) => {
      if (err) {
        logger.info(constants.INTERNAL_ERROR_LOG + err);
        reject();
      }
      resolve(result.length > 0 ? result[0] : undefined);
    });
  });
};

const saveIntoDatabase = async (dao, purchase, response) => {
  return new Promise(async (resolve, reject) => {
    await dao.save(purchase, (err, result) => {
      if (err) {
        logger.info(constants.INTERNAL_ERROR_LOG + err);
        // response.status(500).send({error: 'Não conseguimos incluir a compra.'}); // TODO handle duplicate
        reject(err);
      } else {
        logger.info('SQL Result for create: ' + JSON.stringify(result));
        resolve();
      }
    });
  });
};

// -- used to set status when cpf is the same proposal
const setStatus = purchase => {
  if (purchase.cpf === '153.509.460-56') {
    purchase.status = purchaseStatus.APPROVED;
  }
};

// -- calculate cashback by purchase value
const setCashback = purchase => {
  const value = Number(purchase.valor);
  if (value <= 1000) {
    purchase.porcentagem_cashback = 10;
    purchase.valor_cashback = ((value * 10) / 100).toFixed(2);
  } else if (value > 1000 && value <= 1500) {
    purchase.porcentagem_cashback = 15;
    purchase.valor_cashback = ((value * 15) / 100).toFixed(2);
  } else {
    purchase.porcentagem_cashback = 20;
    purchase.valor_cashback = ((value * 20) / 100).toFixed(2);
  }
};

module.exports = app => {
  return purchase(app);
};
