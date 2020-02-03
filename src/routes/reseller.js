const validate = require('../validation/reseller').validate;


module.exports = (app) => {
    const reseller = app.services.reseller;

    app.post('/revendedor', validate.create, reseller.create);
    app.post('/revendedor/login', validate.login, reseller.login);

    return this;
} 