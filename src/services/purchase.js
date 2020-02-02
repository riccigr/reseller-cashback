const constants = require('../helper/constants');
const logger = require('../helper/logger');
const purchaseStatus = require('../helper/status').PurchaseStatus;
const handleHttp = require('../helper/handleHttpResponse').handleHttp;

const purchase = app => {
  const service = {};
  const dao = prepareDAO(app);
  create(service, dao);
  update(service, dao);
  remove(service, dao);
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

    const purchase = request.body['compra'];

    setStatus(purchase);
    setCashback(purchase);

    saveToDatabase(dao, purchase)
      .then(() => {
        handleHttp.Create(purchase, response);
      })
      .catch(err => {
        if (err.code === 'ER_DUP_ENTRY') {
          handleHttp.Duplicate(response);
        }
        handleHttp.InternalError(response);
      });
  };
};

const update = async (service, dao) => {
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
    // -- search for purchase async
    const purchase = await findPurchaseById(dao, id).then(rows => {
      return rows;
    });

    // -- check if found some result;
    if (purchase) {
      logger.info('Compra encontrada: ' + id);
      if (purchase.status !== purchaseStatus.PENDING) {
        handleHttp.PreconditionFailed(response);
        return;
      }

      const changedPurchase = request.body['compra'];

      updateToDatabase(dao, changedPurchase, id)
        .then(() => {
          handleHttp.Update(changedPurchase, response);
        })
        .catch(err => {
          if (err.code === 'ER_DUP_ENTRY') {
            handleHttp.Duplicate(response);
          }
          handleHttp.InternalError(response);
        });
    } else {
      logger.info('Compra não encontrada: ' + request.params.id);
      handleHttp.NotFound(response);
      return;
    }
  };
};

const remove = async (service, dao) => {
  service.remove = async (request, response) => {
    logger.info('delete received');

    const id = request.params.id;

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
      removeToDatabase(dao, id)
      .then(() => {
        handleHttp.NoContent(response);
      })
      .catch(err => {
        handleHttp.InternalError(response);
      });
  } else {
    logger.info('Compra não encontrada: ' + request.params.id);
    handleHttp.NotFound(response);
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
  logger.info('Procurando id: ' + id);
  return new Promise(async (resolve, reject) => {
    await dao.getById(id, (err, result) => {
      if (err) {
        logger.info(constants.INTERNAL_ERROR_LOG + err);
        reject();
      }
      logger.info('SQL Result for find: ' + JSON.stringify(result));
      resolve(result.length > 0 ? result[0] : undefined);
    });
  });
};

const saveToDatabase = async (dao, purchase) => {
  return new Promise(async (resolve, reject) => {
    await dao.save(purchase, (err, result) => {
      if (err) {
        logger.info(constants.INTERNAL_ERROR_LOG + err);
        reject(err);
      } else {
        logger.info('SQL Result for create: ' + JSON.stringify(result));
        resolve();
      }
    });
  });
};

const updateToDatabase = async (dao, purchase, id) => {
  return new Promise(async (resolve, reject) => {
    await dao.update(purchase, id, (err, result) => {
      if (err) {
        logger.info(constants.INTERNAL_ERROR_LOG + err);
        reject(err);
      } else {
        logger.info('SQL Result for update: ' + JSON.stringify(result));
        resolve();
      }
    });
  });
};

const removeToDatabase = async (dao, id) => {
  return new Promise(async (resolve, reject) => {
    await dao.remove(id, (err, result) => {
      if (err) {
        logger.info(constants.INTERNAL_ERROR_LOG + err);
        reject(err);
      } else {
        logger.info('SQL Result for remove: ' + JSON.stringify(result));
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

// -- instance database connect
const prepareDAO = app => {
  const connection = app.database.connectionFactory();
  const dao = new app.dao.purchaseDAO(connection);
  return dao;
};

module.exports = app => {
  return purchase(app);
};
