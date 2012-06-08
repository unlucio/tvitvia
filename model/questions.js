var _ = require('underscore');

module.exports = (function(questions) {
	
	questions = function(db, tweeterClient) {
		this.db = db;
		this.tweeterClient = tweeterClient;
		//console.log('questions this.tweeterClient -> '+JSON.stringify(this.tweeterClient));
	};
	
	questions.prototype.publishRandom = function() {
		var self = this;
		this.selectAll(function(questionsList){
			var selectedQuestion = self.getRandom(questionsList);
			console.log ('asking -> '+selectedQuestion.question);
			self.tweeterClient.T.post('statuses/update', {status: selectedQuestion.question}, function(err, reply) {
				if (err === null ) {
					self.db.query().
						insert('twittedQuestions',
							['tweetID', 'questionID'],
							[reply.id_str, selectedQuestion.ID]).
							execute(function(error, result) {
								if (error) {
									console.log('insert twittedQuestions ERROR: ' + error);
									return;
								}
						});
				}
				else {
					console.log('we have a tweet error: '+JSON.stringify(err));
				}
			});
		});
	};
	
	questions.prototype.getRandom = function (questionsList) {
		if (questionsList.length <= 0){
			return;
		}
		var randomQuestionID = Math.floor(Math.random()*(questionsList.length+1));
		
		var selectedQuestion = questionsList[randomQuestionID];
		
		console.log("selectedQuestion -> "+JSON.stringify(selectedQuestion));
		
		if (selectedQuestion == null || selectedQuestion.length <= 0) {
			return this.getRandom(questionsList);
		}
		
		return selectedQuestion;
	};
	
	questions.prototype.selectAll = function(callback) {
		this.db.query().
			select('*').
			from('questions').
			execute(function(error, rows, cols) {
				callback(rows);
			});
	};
	
	questions.prototype.setAnswered = function(refTweetID, callback) {
		this.db.query().
			update('twittedQuestions').
			set({ 'answered': 1 }).
			where('tweetID = ?', [ refTweetID ]).
			execute(function(error, result) {
				if (error) {
					console.log("question.setAnswered() ERROR: "+JSON.stringify(error));
				}
				else {
					callback(result);
				}
			});
	}
	
	return questions;
})();