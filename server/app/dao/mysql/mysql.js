var pool = require('generic-pool')
	, mysql = require('mysql')
	, util = require('../../utils/util');

var MysqlClient = module.exports;

MysqlClient.init = function(app) {
	var _pool = initMysqlPool(app);
	MysqlClient.insert = query;
	MysqlClient.update = query;
	MysqlClient.delete = query;
	MysqlClient.query = query;

	function query(sql, args, cb) {
		_pool.acquire(function(err, client) {
			if (!!err) {
				util.getLogger().error('get client from mysql pool failed: ', err.stack);
				return cb(err);
			}
			client.query(sql, args, function(err, replay) {
				cb(err, replay);
				_pool.release(client);
			});
		});
	};

	return MysqlClient;
};


var initMysqlPool = function(app) {
	var mysqlConfig = app.get('mysqlConfig');
	var p = pool.Pool({
		name: 'mysql',
		create: function(callback) {
			var client = mysql.createConnection({
				host: mysqlConfig.host,
				port: mysqlConfig.port,
				user: mysqlConfig.user,
				password: mysqlConfig.password,
				database: mysqlConfig.database
			});
			callback(null, client);
		},
		destroy: function(client) {
			client.end();
		},
		max: 5,
		idleTimeoutMillis: 30000,
		log: false
	});
	return p;
};
