function resellerDAO(connection){
    this._connection = connection;
}

resellerDAO.prototype.save = function(reseller, callback){
    this._connection.query('INSERT INTO revendedor SET ?', reseller, callback);
}

module.exports = () => {
    return resellerDAO;
}