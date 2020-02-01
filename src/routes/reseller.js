module.exports = (app) => {
    console.log(app);
    console.log(app.services);
    const reseller = app.services.reseller;
    console.log(reseller);

    app.post('/reseller', reseller.create);
} 