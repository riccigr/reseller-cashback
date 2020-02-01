function resellerDAO(connection){
    this._connection = connection;
}

resellerDAO.prototype.save = function(reseller, callback){
    this._connection.query('INSERT INTO reseller SET ?', reseller, callback);
}

resellerDAO.prototype.update = function(reseller, callback){
    this._connection.query('UPDATE reseller SET status = ?, update_date = ? where id = ? ', [reseller.status, reseller.update_date, reseller.id], callback);
}

resellerDAO.prototype.getById = function(id, callback) {
    this._connection.query('SELECT * FROM reseller WHERE id = ? LIMIT 1', [id], callback);
}


module.exports = function(){
    return resellerDAO;
}