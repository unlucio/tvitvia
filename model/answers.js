module.exports = (function(answers) {
	
	answers = function(db, tweeterClient) {
		this.db = db;
		this.tweeterClient = tweeterClient;
		//console.log('answers this.tweeterClient -> '+JSON.stringify(this.tweeterClient));
	};
	
	answers.prototype.checkMatch =  function (refTweetID, userAnswer, callback) {
		console.log("checkMatch("+refTweetID+", "+userAnswer);
		
		var self = this;
		
		this.db.query().
		select('*').
		from('twittedQuestions').
		where('tweetID = ?', [ refTweetID ]).
		execute(function(error, rows, cols) {
			
			if (rows[0].answered) {
				console.log("Question already answered!");
				calback('answered');
				return;
			}
			
			self.db.query().
				select('*').
				from('aswers').
				where('questionID = ?', [ rows[0].questionID ]).
				execute(function(error, rows, cols) {
					console.log('matching ---> especting:'+rows[0].value+' user said:'+userAnswer);
					
					if (rows[0].value == userAnswer) {
						callback('ok');
					}
					else {
						callback('ko')
					}
				});
		});
	};

	return answers;
})();