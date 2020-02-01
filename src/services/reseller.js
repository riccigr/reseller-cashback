

module.exports = app => {
    const service = {};

    service.create = (request, response) => {
      request.assert('reseller.full_name', 'Full name is mandatory').notEmpty();
      request.assert('reseller.cpf', 'CPF is mandatory').notEmpty();
      request.assert('reseller.email', 'E-mail is mandatory').notEmpty();
      request.assert('reseller.password', 'Password is mandatory').notEmpty();
    
      const invalid = request.validationErrors();
      if (invalid) {
        response.status(400).send(invalid);
        return;
      }
    
      const reseller = request.body['reseller'];
    
      const connection = app.database.connectionFactory();
      const dao = new app.database.resellerDAO(connection);
    
      dao.save(reseller, (err, result) => {
        if (err) {
          res.status(500).send("erro");
          connection.end();
          return;
        }
    
        reseller.id = result.insertId;
        response.location('/reseller/' + reseller.id);
        response.status(201).json(reseller);
      });
    
      connection.end();
    
      response.status(201).json('OK');
    };

    return service;
};
