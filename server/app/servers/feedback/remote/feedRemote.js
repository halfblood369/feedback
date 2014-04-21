var util = require('../../../utils/util')
	, consts = require('../../../consts/consts');

module.exports = function(app) {
	return new FeedRemote(app);
};

var FeedRemote = function(app) {
	this.app = app;
};

FeedRemote.prototype.addUserToChannel = function(uid, sid, channelName, cb) {
	var self = this, channelService = self.app.get('channelService');
	var channel = channelService.getChannel(channelName, true);
	var username = uid.split('_')[0];

	channel.pushMessage({
		route: 'onAdd',
		user: username
	});
	channel.add(uid, sid);
	
	var members = _getChannelMembers(channel);
	cb(members);
};

function _getChannelMembers(channel) {
	var returnUsers = [], users = channel.getMembers();
	users.forEach(function(item) {
		returnUsers.push(item.split('_')[1]);
	});
	return returnUsers;
};
