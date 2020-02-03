const handleHttp = require('../helper/handleHttpResponse').handleHttp;
const logger = require('../helper/logger');
const constants = require('../helper/constants');

const validate = {
  create: (request, response, next) => {
    request.assert('revendedor.cpf', 'CPF é obrigatório').notEmpty().trim(); 
    request.assert('revendedor.cpf', 'CPF deve ser numérico').matches(/^[0-9\s]+$/); 
    request.assert('revendedor.cpf', 'CPF deve ter 11 posicoes').isLength({ min: 11, max:11 }); 
    request.assert('revendedor.nome', 'Nome é obrigatório').notEmpty().trim();
    request.assert('revendedor.nome', 'Nome deve ter entre 3 e 50 caracteres').isLength({ min: 3, max:50 });
    request.assert('revendedor.nome', 'Nome deve ter apenas letras').matches(/^[A-Za-z\s]+$/);
    request.assert('revendedor.email', 'E-mail é obrigatório').notEmpty();
    request.assert('revendedor.email', 'E-mail não é válido').isEmail();
    request.assert('revendedor.email', 'E-mail deve ter entre 3 e 250 caracteres').isLength({ min: 3, max:250 });
    request.assert('revendedor.senha', 'Senha é obrigatória').notEmpty().trim();
    request.assert('revendedor.senha', 'Senha deve ter entre 3 e 50 caracteres').isLength({ min: 3, max:50 });

    const invalid = request.validationErrors();
    if (invalid) {
      logger.info(constants.CLIENT_ERROR_LOG + invalid);
      handleHttp.BadRequest({ errors: invalid }, response);
      return;
    } else {
      next();
    }
  },

  login: (request, response, next) => {
    request.assert('login.cpf', 'CPF é obrigatório').notEmpty().trim();
    request.assert('login.cpf', 'CPF deve ser numérico').matches(/^[0-9\s]+$/);
    request.assert('login.cpf', 'CPF deve ser 11 posicoes').isLength({ min: 11, max:11 });
    request.assert('login.senha', 'Senha é obrigatória').notEmpty().trim();
    request.assert('login.senha', 'Senha deve ter entre 3 e 50 caracteres').isLength({ min: 3, max:50 });

    const invalid = request.validationErrors();
    if (invalid) {
      logger.info(constants.CLIENT_ERROR_LOG + invalid);
      handleHttp.BadRequest({ errors: invalid }, response);
      return;
    } else {
      next();
    }
  }
};

module.exports = { validate };
