module.exports = (function(users) {
	
	users = function(db, tweeterClient) {
		console.log('user object created');
		this.db = db;
		this.tweeterClient = tweeterClient;
		//console.log('users this.tweeterClient -> '+JSON.stringify(this.tweeterClient));
	};
	
	users.prototype.find = function(userName, callback) {
		this.db.query().
			select('*').
			from('users').
			where('twUser = ?', [ userName ]).
			execute(function(error, rows, cols) {
				if (error) {
					console.log('user.find('+user+') ERROR: ' + error);
					return;
				}
				callback(rows);
			});
	};
	
	users.prototype.add = function(userName, callback) {
		this.db.query().
			insert('users',
				['twUser'],
				[ userName ]).
				execute(function(error, result) {
					if (error) {
						console.log('insert user ERROR: ' + error);
						return;
					}
					
					if (typeof callback == 'function') {
						callback(result);
					}
				});
	};
	
	users.prototype.capture = function(userName, callback) {
		var self = this;
		this.find(userName, function(result){
			if (result.length <=0) {
				self.add(userName, function(result){
					if (typeof callback == 'function') {
						callback(result);
					}
				});
			}
			else{
				if (typeof callback == 'function') {
					callback(result);
				}
			}
		});
	};
	
	
	users.prototype.scorePoint = function(userName, callback) {
		var self = this;
		this.capture(userName, function(result){
			
			console.log("scorePoint result -> "+JSON.stringify(result));
			
			if (result.affected == 1){
				self._updateScore(result.id, callback);
			}
			else {
				self._updateScore(result[0].ID, userName, callback);
			}
		});
	};
	
	users.prototype._updateScore = function(userID, thePlayer, callback){
		console.log('correctAnswer, updating score --> the player has ID '+ userID);
		var self = this;
		this.db.query().
			select('*').
			from('points').
			where('userID = ?', [ userID ]).
			execute(function(error, rows, cols) {
				console.log('correctAnswer, updating score --> the player has score row '+ JSON.stringify(rows));
				if (rows.length > 0) {
					var scorePoints = rows[0].value+1
					self.db.query().
						update('points').
						set({ 'value': scorePoints }).
						where('userID = ?', [userID]).
						execute(function(error, result) {
							if (error) {
								console.log('update points ERROR: ' + error);
								return;
							}
							else {
								self.tweeterClient.sendMention(thePlayer, 'Correct! Your updated score is now: '+scorePoints+' points');
								if (typeof callback == 'function') {
									callback(result);
								}
								return;
							}
							console.log('RESULT: ', result);
						});
				}
				else {
					var scorePoints = 1;
					self.db.query().
						insert('points',
							['userID', 'value'],
							[userID, scorePoints]).
							execute(function(error, result) {
								if (error) {
									console.log('insert pints ERROR: ' + error);
									return;
								}
								else {
									self.tweeterClient.sendMention(thePlayer, 'Correct! Your updated score is now: '+scorePoints+' points');
									if (typeof callback == 'function') {
										callback(result);
									}
									return
								}
							});
				}
			});
	};
	
	return users;
})();