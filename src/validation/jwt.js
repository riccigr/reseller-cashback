const jwt = require('jsonwebtoken');
const handleHttp = require('../helper/handleHttpResponse').handleHttp;
const properties = require('../config/properties').properties;
const logger = require('../helper/logger');

const verifyJWT = (request, response, next) => {
  const token = request.headers.token;

  if (!token) {
    logger.info('Sem token');
    return handleHttp.Unauthorized({ auth: false, erro: 'Informe o token no header.' }, response);
  }


};

module.exports = { verifyJWT };
