var log4js = require('log4js')
	, crc = require('crc');

var Util = exports;
var index = 0, LOG_FILE_PATH = '../../config/log4js.json';

Util.routeConnector = function(uid, length) {
	console.log(arguments);
	console.error('crc: %j length: %j', Math.abs(crc.crc32(uid)), length)
	return Math.abs(crc.crc32(uid)) % length;
};

Util.initLogs = function() {
	log4js.loadAppender('file');
	log4js.addAppender(log4js.appenders.file(LOG_FILE_PATH), 'servers');
	log4js.addAppender(log4js.appenders.file(LOG_FILE_PATH), 'pomelo');
}

Util.getLogger = function() {
	var logger = require('log4js').getLogger('server');
	var level = getLevel('server');
	logger.setLevel(level);
	return logger;
};

function getLevel(category) {
	return require(LOG_FILE_PATH)['levels'][category];
};

