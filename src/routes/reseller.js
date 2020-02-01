module.exports = (app) => {
    const reseller = app.services.reseller;

    app.post('/reseller', reseller.create);

    return this;
} 