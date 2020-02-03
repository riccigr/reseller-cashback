const checkLogin = require('../validation/jwt');
const validate = require('../validation/purchase').validate;


module.exports = (app) => {
    const purchase = app.services.purchase;

    app.post('/compra', validate.create, checkLogin, purchase.create);
    app.put('/compra/:id', validate.update, checkLogin, purchase.update);
    app.delete('/compra/:id', checkLogin, purchase.remove);
    app.get('/compra/:id', checkLogin, purchase.getByCpf);

    return this;
} 