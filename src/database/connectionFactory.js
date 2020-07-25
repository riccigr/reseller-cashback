const mysql = require('mysql');
const properties = require('../config/properties').properties;

// eslint-disable-next-line consistent-return
const createDbConnection = () => {
  if (process.env.NODE_ENV === 'production') {
    const url = process.env.DB_DATABASE_URL;
    const groups = url.match(/mysql:\/\/(.*):(.*)@(.*)\/(.*)\?/);
    return mysql.createPool({
      connectionLimit: 10,
      host: groups[3],
      user: groups[1],
      password: groups[2],
      database: groups[4]
    });
  }

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev') {
    return mysql.createPool({
      connectionLimit: 2,
      host: properties.database.dev.host,
      user: properties.database.dev.user,
      password: properties.database.dev.password,
      database: properties.database.dev.database
    });
  }

  if (process.env.NODE_ENV === 'test') {
    return mysql.createConnection({
      host: properties.database.test.host,
      user: properties.database.test.user,
      password: properties.database.test.password,
      database: properties.database.test.database
    });
  }
};

// wrapper
module.exports = () => {
  return createDbConnection;
};
