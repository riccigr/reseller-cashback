const checkLogin = require('../validation/jwt');


module.exports = (app) => {
    const purchase = app.services.purchase;

    app.post('/compra', checkLogin, purchase.create);
    app.put('/compra/:id', checkLogin, purchase.update);
    app.delete('/compra/:id', checkLogin, purchase.remove);
    app.get('/compra/:id', checkLogin, purchase.getByCpf);

    return this;
} 