const properties = {
  express: {
    port: 3000
  },
  jwt: {
    secret: 'extremesecret', // --should be in env var
    expiresIn: 300
  },
  database: {
    dev: {
      host: 'localhost',
      user: 'root',
      password: 'root', // --should be in env var
      database: 'db_reseller'
    },
    test: {
      host: 'localhost',
      user: 'root',
      password: 'root', // --should be in env var
      database: 'db_reseller_test'
    }
  },
  winston: {
    logDir: 'logs',
    level: 'info',
    filename: 'logs/info.log',
    maxsize: 6000,
    maxFiles: 10,
    handleExceptions: false,
    humanReadableUnhandleExceptions: false
  },
  externalApi: {
    cashback: {
      url: 'https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1/cashback',
      token: 'ZXPURQOARHiMc6Y0flhRC1LVlZQVFRnm',
      timeout: 2000
    }
  }
};

module.exports = { properties };
