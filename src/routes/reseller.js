module.exports = (app) => {
    const reseller = app.services.reseller;

    app.post('/revendedor', reseller.create);
    app.post('/revendedor/login', reseller.login);

    return this;
} 