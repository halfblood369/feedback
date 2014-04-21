var pomelo = require('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'feedback');

app.configure('production|development', function() {
	app.loadConfig('mysqlConfig', app.getBase() + '/config/mysql.json');
	var mysqlClient = require('./app/dao/mysql/mysql').init(app);
	app.set('mysqlClient', mysqlClient);
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
