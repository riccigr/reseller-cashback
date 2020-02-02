module.exports = (app) => {
    const purchase = app.services.purchase;

    app.post('/compra', purchase.create);
    app.put('/compra/:id', purchase.update);
    app.delete('/compra/:id', purchase.remove);
    app.get('/compra/:id', purchase.getByCpf);

    return this;
} 