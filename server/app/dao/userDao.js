var pomelo = require('pomelo')
	, User = require('../entity/user');

var UserDao = module.exports;

UserDao.getUserByName = function(name, cb) {
	var sql = 'select * from User where name = ?';
	var args = [name];
	pomelo.app.get('mysqlClient').query(sql, args, function(err, res) {
		if (!!err) {
			return cb(err);
		}
		if (!!res && res.length > 0) {
			return cb(null, new User(res[0]));
		}
		return cb(null, null);
	});	
};

UserDao.createUser = function(name, password, cb) {
	var sql = 'insert into User (name, password, lastLoginTime) values (?,?,?)';
	var time = Date.now();
	var args = [name, password, time];
	pomelo.app.get('mysqlClient').insert(sql, args, function(err, res) {
		if (!!err) {
			return cb(err);
		}
		var user = new User({
			id: res.insertId,
			name: name,
			password: password,
			lastLoginTime: time
		});
		return cb(null, User);
	});
}
