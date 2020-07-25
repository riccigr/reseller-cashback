const logger = require('../helper/logger');

function purchaseDAO(connection) {
  this.dbConnection = connection;
}

purchaseDAO.prototype.save = function save(purchase, callback) {
  logger.info(purchase);
  this.dbConnection.query('INSERT INTO compra SET ?', purchase, callback);
};

purchaseDAO.prototype.update = function update(purchase, id, callback) {
  this.dbConnection.query('UPDATE compra SET ? where codigo = ? ', [purchase, id], callback);
};

purchaseDAO.prototype.remove = function remove(id, callback) {
  this.dbConnection.query('DELETE FROM compra where codigo = ? ', [id], callback);
};

purchaseDAO.prototype.getById = function getById(id, callback) {
  this.dbConnection.query('SELECT * FROM compra WHERE codigo = ? LIMIT 1', [id], callback);
};

purchaseDAO.prototype.getByCpf = function getByCpf(id, callback) {
  this.dbConnection.query(
    `SELECT c.codigo, c.valor, c.data, c.cpf, c.valor_cashback, c.porcentagem_cashback, sc.descricao 
                            FROM compra c LEFT JOIN status_compra sc on c.status = sc.status WHERE cpf = ?`,
    [id],
    callback
  );
};

module.exports = () => {
  return purchaseDAO;
};
