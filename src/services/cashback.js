const externalRequest = require('request');
const logger = require('../helper/logger');
const constants = require('../helper/constants');
const handleHttp = require('../helper/handleHttpResponse').handleHttp;
const properties = require('../config/properties').properties;
const util = require('../helper/utils').util;

const mountURL = id => {
  const cpf = util.cleanupString(id);
  const queryParams = `?cpf=${cpf}`;
  const url = properties.externalApi.cashback.url + queryParams;
  logger.info(`URL: ${url}`);
  return url;
};

const handleResponse = (payload, response) => {
  const cashback = {};
  cashback.valor = util.adjustDecimal(payload.body.credit);
  logger.info(`response: ${cashback}`);
  handleHttp.Ok(cashback, response);
};

const handleErrors = (err, response) => {
  logger.info(constants.INTERNAL_ERROR_LOG + err);
  if (err.code === 'ETIMEDOUT') {
    handleHttp.BadGateway(response);
  }
  handleHttp.ServiceUnavailable(response);
};

const get = () => {
  const service = {};
  service.get = (request, response) => {
    logger.info('cashback get received');

    // -- prepare url
    const url = mountURL(request.params.id);

    // -- call cashback api
    externalRequest.get(
      {
        url,
        headers: { token: properties.externalApi.cashback.token },
        timeout: properties.externalApi.cashback.timeout
      },
      (err, res, body) => {
        if (err) {
          handleErrors(err, response);
        }
        const payload = JSON.parse(body);
        logger.info(`Resultado da consulta: ${payload}`);

        if (payload.statusCode === 200) {
          handleResponse(payload, response);
        } else {
          handleHttp.NotFound(response);
        }
      }
    );
    logger.info('cashback get end.');
  };
  return service;
};

const cashback = () => {
  const service = get();
  return service;
};

module.exports = () => {
  return cashback();
};
