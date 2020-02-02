module.exports = (app) => {
    const purchase = app.services.purchase;

    app.post('/compra', purchase.create);

    return this;
} 