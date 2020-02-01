
const service = {};

service.create = (request, response) => {

    request.assert('reseller.full_name', 'Full name is mandatory').notEmpty();
    request.assert('reseller.cpf', 'CPF is mandatory').notEmpty();
    request.assert('reseller.email', 'E-mail is mandatory').notEmpty()
    request.assert('reseller.password', 'Password is mandatory').notEmpty()

    const invalid = request.validationErrors();
    if(invalid){
        response.status(400).send(invalid);
        return;
    }

    response.status(201).json('OK');
}

module.exports = (app) =>  {
    return service;
}