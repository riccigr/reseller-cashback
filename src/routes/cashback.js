module.exports = app => {
  const cashbackService = app.services.cashback;

  app.get('/cashback/:id', cashbackService.get);

  return this;
};
