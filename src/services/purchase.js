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
  getByCpf(service, dao);

  return service;
};

// -- Insert a new purchase
const create = async (service, dao) => {
  service.create = async (request, response) => {
    logger.info('create received');

    const purchase = request.body.compra;

    cleanupPayload(purchase);
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

// -- update a purchase
const update = async (service, dao) => {
  service.update = async (request, response) => {
    logger.info('update received');

    const id = request.params.id;

    // -- search for purchase async
    const purchase = await findPurchaseById(dao, id).then(rows => {
      return rows;
    });

    // -- check if found some result;
    if (purchase) {
      logger.info(`Compra encontrada: ${id}`);
      if (purchase.status !== purchaseStatus.PENDING) {
        handleHttp.PreconditionFailed(response);
        return;
      }

      const changedPurchase = request.body.compra;
      cleanupPayload(changedPurchase);
      setStatus(changedPurchase);
      setCashback(changedPurchase);

      updateToDatabase(dao, changedPurchase, id)
        .then(() => {
          handleHttp.Update({}, response);
        })
        .catch(err => {
          if (err.code === 'ER_DUP_ENTRY') {
            handleHttp.Duplicate(response);
          }
          handleHttp.InternalError(response);
        });
    } else {
      logger.info(`Compra não encontrada: ${request.params.id}`);
      handleHttp.NotFound(response);
    }
  };
};

// -- delete a purchase
const remove = async (service, dao) => {
  service.remove = async (request, response) => {
    logger.info('delete received');

    const id = request.params.id;

    // -- search for purchase async
    const purchase = await findPurchaseById(dao, id).then(rows => {
      return rows;
    });

    if (purchase) {
      logger.info(`Compra encontrada: ${id}`);
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
      logger.info(`Compra não encontrada: ${request.params.id}`);
      handleHttp.NotFound(response);
    }
  };
};

// -- find all purchases by cpf
const getByCpf = async (service, dao) => {
  service.getByCpf = async (request, response) => {
    logger.info('getByCpf received');

    const cpf = Number(request.params.id);

    // -- search for purchase async
    const purchase = await findPurchaseByCPF(dao, cpf).then(rows => {
      return rows;
    });

    if (purchase) {
      logger.info(`Compra encontrada: ${cpf}`);
      handleHttp.Ok(purchase, response);
    } else {
      logger.info(`Compra não encontrada: ${cpf}`);
      handleHttp.NotFound(response);
    }
  };
};

// =============================================

const findPurchaseById = async (dao, id) => {
  logger.info(`Procurando id: ${id}`);
  return new Promise(async (resolve, reject) => {
    await dao.getById(id, (err, result) => {
      if (err) {
        logger.info(constants.INTERNAL_ERROR_LOG + err);
        reject();
      }
      logger.info(`SQL Result for find: ${JSON.stringify(result)}`);
      resolve(result.length > 0 ? result[0] : undefined);
    });
  });
};

const findPurchaseByCPF = async (dao, cpf) => {
  logger.info(`Procurando CPF: ${cpf}`);
  return new Promise(async (resolve, reject) => {
    await dao.getByCpf(cpf, (err, result) => {
      if (err) {
        logger.info(constants.INTERNAL_ERROR_LOG + err);
        reject();
      }
      logger.info(`SQL Result for find: ${JSON.stringify(result)}`);
      resolve(result.length > 0 ? result : undefined);
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
        logger.info(`SQL Result for create: ${JSON.stringify(result)}`);
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
        logger.info(`SQL Result for update: ${JSON.stringify(result)}`);
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
        logger.info(`SQL Result for remove: ${JSON.stringify(result)}`);
        resolve();
      }
    });
  });
};

// =============================================

const cleanupPayload = purchase => {
  delete purchase.status;
  delete purchase.valor_cashback;
  delete purchase.porcentagem_cashback;
};

// -- used to set status when cpf is the same proposal
const setStatus = purchase => {
  if (purchase.cpf === '15350946056') {
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

// =============================================

// -- instance database connect
const prepareDAO = app => {
  const connection = app.database.connectionFactory();
  const dao = new app.dao.purchaseDAO(connection);
  return dao;
};

module.exports = app => {
  return purchase(app);
};
