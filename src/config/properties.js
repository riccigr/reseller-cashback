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
  },
  winston: {
    logDir: "logs",
    level: "info",
    filename: "logs/info.log",
    maxsize: 6000,
    maxFiles:10,
    handleExceptions: true,
    humanReadableUnhandleExceptions : true
  }
};

module.exports = { properties };
