var util = require('../../../utils/util')
	, consts = require('../../../consts/consts');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

Handler.prototype.talk = function(message, session, next) {
	util.getLogger().debug('The message from client is %j', message);
	var self = this;
	var uid = session.get('uid'), username = uid.split('_')[1], channelName = uid.split('_')[0];
	var channelService = self.app.get('channelService');
	var channel = channelService.getChannel(channelName, false);
	if (!channel) {
		return util.getLogger().error('The channel named %j is not exist', channelName);
	}
	var info = {
		route: 'onChat',
		msg: message.content,
		from: username,
		target: message.target
	};
	if (message.target == "*") {
		channel.pushMessage(info);
	} else {
		var uid = channelName + '_' + message.target;
		var sid = channel.getMember(uid)['sid'];
		channelService.pushMessageByUids(info, [{
			uid: uid,
			sid: sid
		}]);
	}
	next(null, {
		route: message.route
	});
}
