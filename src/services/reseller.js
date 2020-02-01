module.exports = (app) =>  {
    const service = {};

    service.create = (request, response) => {
        response.status(201).json('OK');
    }

    return service;
}