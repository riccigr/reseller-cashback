module.exports = (app) => {
    const cashback = app.services.cashback;

    app.get('/cashback/:id', cashback.get);

    return this;
} 