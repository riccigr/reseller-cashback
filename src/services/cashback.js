const logger = require('../helper/logger');
const constants = require('../helper/constants');
const handleHttp = require('../helper/handleHttpResponse').handleHttp;
const externalRequest = require('request');
const properties = require('../config/properties').properties;

const cashback = app => {
  const service = {};
  get(service, app);
  return service;
};

const get = (service, app) => {
  service.get = (request, response) => {
    logger.info('cashback get received');

    // -- prepare url  
    let cpf = request.params.id;
    cpf = cpf.replace('.','').replace('-','');
    const queryParams = '?cpf=' + cpf;
    const url = properties.externalApi.cashback.url + queryParams;

    // -- call cashback api
    externalRequest.get(
      {
        url,
        headers: { token: properties.externalApi.cashback.token },
        timeout:  properties.externalApi.cashback.timeout
      },
      (err, res, body) => {
        if (err) {        
          logger.info(constants.INTERNAL_ERROR_LOG + err);
          if (err.code === 'ETIMEDOUT'){
            handleHttp.BadGateway(response);
          }
          handleHttp.ServiceUnavailable(response);
        }
        const payload = JSON.parse(body);
        logger.info('Resultado da consulta: ' + payload);
        if (payload.statusCode === 200) {
          const cashback = {};
          let amount = payload.body.credit;
          amount = amount / 100;
          cashback.valor = amount;
          handleHttp.Ok(cashback, response);
        } else {
          handleHttp.NotFound(response);
        }
      }
    );
    logger.info('cashback get end.');
  };
};

module.exports = app => {
  return cashback(app);
};
