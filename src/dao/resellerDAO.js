function resellerDAO(connection) {
  this.dbConnection = connection;
}

resellerDAO.prototype.save = function save(reseller, callback) {
  this.dbConnection.query('INSERT INTO revendedor SET ?', reseller, callback);
};

resellerDAO.prototype.getById = function getById(id, callback) {
  this.dbConnection.query('SELECT * FROM revendedor WHERE cpf = ? LIMIT 1', [id], callback);
};

module.exports = () => {
  return resellerDAO;
};
