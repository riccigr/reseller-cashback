function purchaseDAO(connection){
    this._connection = connection;
}

purchaseDAO.prototype.save = function(purchase, callback){
    this._connection.query('INSERT INTO compra SET ?', purchase, callback);
}

purchaseDAO.prototype.update = function(purchase, id, callback){
    this._connection.query('UPDATE compra SET ? where codigo = ? ', [purchase, id], callback);
}

purchaseDAO.prototype.getById = function(id, callback){
    this._connection.query('SELECT * FROM compra WHERE codigo = ? LIMIT 1', [id], callback);
}

module.exports = () => {
    return purchaseDAO;
}