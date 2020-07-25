const constants = require('../helper/constants');
const logger = require('../helper/logger');
const handleHttp = require('../helper/handleHttpResponse').handleHttp;
const generateHash = require('../helper/crypto').generateHash;
const checkHash = require('../helper/crypto').checkHash;
const properties = require('../config/properties').properties;
const jwt = require('jsonwebtoken');

const reseller = app => {
  const service = {};
  const dao = prepareDAO(app);

  create(service, dao);
  login(service, dao);

  return service;
};

// -- Insert a new reseller
const create = (service, dao) => {
  service.create = (request, response) => {
    const reseller = request.body.revendedor;

    encryptPassword(reseller);

    saveToDatabase(dao, reseller)
      .then(() => {
        handleResponse(reseller, response);
      })
      .catch(err => {
        if (err.code === 'ER_DUP_ENTRY') {
          handleHttp.Duplicate(response);
        }
        handleHttp.InternalError(response);
      });
  };
};

const login = async (service, dao) => {
  service.login = async (request, response) => {
    const login = request.body.login;
    const cpf = login.cpf;

    const reseller = await findResellerByCpf(dao, cpf)
      .then(rows => {
        return rows;
      })
      .catch(err => {
        handleHttp.InternalError(response);
      });

    if (reseller) {
      const passwordOK = checkHash(login.senha, reseller.senha);
      if (passwordOK) {
        logger.info(`Login ok: ${cpf}`);

        // -- generete jwt
        const token = jwt.sign({ cpf }, properties.jwt.secret, {
          expiresIn: properties.jwt.expiresIn
        });

        handleHttp.Ok({ auth: true, token }, response);
      } else {
        handleHttp.Unauthorized({ auth: false }, response);
      }
    } else {
      handleHttp.NotFound(response);
    }
  };
};

const findResellerByCpf = async (dao, cpf) => {
  logger.info(`Procurando id: ${cpf}`);
  return new Promise(async (resolve, reject) => {
    await dao.getById(cpf, (err, result) => {
      if (err) {
        logger.info(constants.INTERNAL_ERROR_LOG + err);
        reject();
      }
      logger.info(`SQL Result for find: ${JSON.stringify(result)}`);
      resolve(result.length > 0 ? result[0] : undefined);
    });
  });
};

// -- persist into database
const saveToDatabase = async (dao, reseller) => {
  return new Promise(async (resolve, reject) => {
    await dao.save(reseller, (err, result) => {
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

// -- prepare response removing unnecessary fields
const handleResponse = (reseller, response) => {
  delete reseller.senha;
  handleHttp.Create(reseller, response);
};

// -- deal
const encryptPassword = reseller => {
  reseller.senha = generateHash(reseller.senha);
};

// -- instance database connect
const prepareDAO = app => {
  const connection = app.database.connectionFactory();
  const dao = new app.dao.resellerDAO(connection);
  return dao;
};

module.exports = app => {
  return reseller(app);
};
