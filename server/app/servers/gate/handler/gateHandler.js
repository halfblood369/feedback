var util = require('../../../utils/util')
	, consts = require('../../../consts/consts');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

Handler.prototype.queryEntry = function(message, session, next) {
	util.getLogger().debug('The message from client is %j', message);
	var self = this;
	if (!message.uid) {
		util.getLogger().error('The uid from message is null!');
		return next(null, {
			code: consts.CODE.ERROR_CLIENT, 
			content: 'The uid is required!'
		});
	}

	var connectors = self.app.getServersByType('connector');
	if (!connectors || connectors.length === 0) {
		util.getLogger().error('The server connector is not exist!');
		return next(null, {
			code: consts.CODE.ERROR_SERVER, 
			content: 'The server connector is not exist!'
		});
	}

	var index = util.routeConnector(message.uid, connectors.length);
	console.error('index: ', index);
	next(null, {
		code: consts.CODE.SUCCESS,
		host: connectors[index].host,
		port: connectors[index].clientPort
	})
};
