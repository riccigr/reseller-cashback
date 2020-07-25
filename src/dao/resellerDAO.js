function resellerDAO(connection) {
  this._connection = connection;
}

resellerDAO.prototype.save = function(reseller, callback) {
  this._connection.query('INSERT INTO revendedor SET ?', reseller, callback);
};

resellerDAO.prototype.getById = function(id, callback) {
  this._connection.query('SELECT * FROM revendedor WHERE cpf = ? LIMIT 1', [id], callback);
};

module.exports = () => {
  return resellerDAO;
};
