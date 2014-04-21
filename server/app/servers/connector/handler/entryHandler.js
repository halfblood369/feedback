var util = require('../../../utils/util')
	, consts = require('../../../consts/consts')
	, userDao = require('../../../dao/userDao'); 

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.passingEnter = function(message, session, next) {
	util.getLogger().debug('The message from client is %j', message);
	rid = message.rid, username = message.username;
	var uid = rid + '_' + username;
	this._bind(uid, rid, session, next);
};

Handler.prototype.memberEnter = function(message, session, next) {
	util.getLogger().debug('The message from client is %j', message);
	var self = this, rid = message.rid, username = message.username, password = message.password;
	var uid = rid + '_' + username;
	userDao.getUserByName(username, function(err, user) {
		if (!!err) {
			return util.getLogger().error('get user by username failed: ', err.message);
		}
		if (!!user) {
			return self._bind(uid, rid, session, next);
		}
		userDao.createUser(username, password, function(err, user) {
			if (!!err) {
				return util.getLogger().error('create user by username failed: ', err.message);
			}
			return self._bind(uid, rid, session, next);
		})
	});
};

Handler.prototype._bind = function(uid, rid, session, next) {
	var self = this;
	session.bind(uid, function(err) {
		if (!!err) {
			util.getLogger().error('Session bind failed: ', err);
			return next(null, {
				code: consts.CODE.ERROR_SERVER,
				content: 'server error'
			});
		}
		session.set('uid', uid);
		session.push('uid', function(err) {
			if (!!err) {
				util.getLogger().error('Session push failed: ', err);
			}
		});
		self.app.rpc.feedback.feedRemote.addUserToChannel(session, uid, self.app.get('serverId'), rid, function(allUsers) {
			next(null, {
				code: consts.CODE.SUCCESS,
				users: allUsers
			})
		});
	})
};
