var Twit = require('twit');

module.exports = (function(twitterClient) {
	
	twitterClient = function(datas) {
		this.T = new Twit(datas);
	};
	
	twitterClient.prototype.publishTweet = function (message) {
		this.T.post('statuses/update', {status: message}, function(err, reply) {
			console.log('publishTweet --> '+message);
			console.log('publishTweet -err-> '+JSON.stringify(err));
		});
	};

	twitterClient.prototype.sendMention = function (to, message) {
		this.T.post('statuses/update', 
		{status: '@'+to+' '+message}, function(err, reply) {
			console.log('sendMention --> to:'+to+' '+message);
			console.log('sendMention -err-> '+JSON.stringify(err));
		});
	};

	twitterClient.prototype.sendDM = function (to, message) {
		this.T.post('direct_messages/new', { screen_name: to, text: message}, function(err, reply) {
			console.log('sendDM --> to'+to+' '+message);
			console.log('sendDM -err-> '+JSON.stringify(err));
		});
	};
	
	twitterClient.prototype.followUser = function (user) {
		console.log("following user: "+user);
		this.T.post('friendships/create', 
		{screen_name: user, follow: true}, function(err, reply) {
			console.log('sendMention --> to:'+to+' '+message);
			console.log('sendMention -err-> '+JSON.stringify(err));
		});
	};
	
	return twitterClient;
})();