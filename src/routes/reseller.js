module.exports = (app) => {
    const reseller = app.services.reseller;

    app.post('/revendedor', reseller.create);

    return this;
} 