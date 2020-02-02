function purchaseDAO(connection){
    this._connection = connection;
}

purchaseDAO.prototype.save = function(purchase, callback){
    this._connection.query('INSERT INTO compra SET ?', purchase, callback);
}

module.exports = () => {
    return purchaseDAO;
}