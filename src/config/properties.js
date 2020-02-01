const properties = {
  express: {
    port: 3000
  },
  database: {
    dev: {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'db_reseller'
    },
    test: {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'db_reseller_test'
    }
  }
};

module.exports = { properties };
