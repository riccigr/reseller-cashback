const handleHttp = require('../helper/handleHttpResponse').handleHttp;
const logger = require('../helper/logger');
const constants = require('../helper/constants');

const validate = {
  create: (request, response, next) => {
    request
      .assert('compra.cpf', 'CPF é obrigatório')
      .notEmpty()
      .trim();
    request.assert('compra.cpf', 'CPF deve ser numérico').matches(/^[0-9\s]+$/);
    request.assert('compra.cpf', 'CPF deve ter 11 posicoes').isLength({ min: 11, max: 11 });
    request.assert('compra.codigo', 'Codigo é obrigatório').notEmpty();
    request.assert('compra.codigo', 'Codigo deve ser numérico').matches(/^[0-9\s]+$/);
    request.assert('compra.codigo', 'Codigo deve ter 10 posições numéricas').isLength({ min: 1, max: 10 });
    request.assert('compra.valor', 'Valor é obrigatório').notEmpty();
    request.assert('compra.valor', 'Valor não permitido').isDecimal({ min: 1, max: 9999999999999 });
    request.assert('compra.data', 'Data é obrigatória').notEmpty();
    request.assert('compra.data', 'Data é deve estar no formato YYYY-MM-DD').isISO8601();

    const invalid = request.validationErrors();
    if (invalid) {
      logger.info(constants.CLIENT_ERROR_LOG + invalid);
      handleHttp.BadRequest({ errors: invalid }, response);
    } else {
      next();
    }
  },

  update: (request, response, next) => {
    request
      .assert('compra.cpf', 'CPF é obrigatório')
      .notEmpty()
      .trim();
    request.assert('compra.cpf', 'CPF deve ser numérico').matches(/^[0-9\s]+$/);
    request.assert('compra.cpf', 'CPF deve ter 11 posicoes').isLength({ min: 11, max: 11 });
    request.assert('compra.valor', 'Valor é obrigatório').notEmpty();
    request.assert('compra.valor', 'Valor não permitido').isDecimal({ min: 1, max: 9999999999999 });
    request.assert('compra.data', 'Data é obrigatória').notEmpty();
    request.assert('compra.data', 'Data é deve estar no formato YYYY-MM-DD').isISO8601();

    const invalid = request.validationErrors();
    if (invalid) {
      logger.info(constants.CLIENT_ERROR_LOG + invalid);
      handleHttp.BadRequest({ errors: invalid }, response);
    } else {
      next();
    }
  }
};

module.exports = { validate };
