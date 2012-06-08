console.log('starting twitvia!');

var mysql = require('db-mysql'),
	TwetterClient = require('./lib/twitterClient'),
	Users = require('./model/users'),
	Questions = require('./model/questions'),
	Answers = require('./model/answers');

var myDb = new mysql.Database({
	hostname: 'localhost',
	user: 'root',
	password: 'cippa',
	database: 'twitvia'
});

myDb.on('error', function(error) {
	console.log('main ERROR: ' + error);
});

myDb.on('ready', function(server) {
	console.log('Connected to mySqlDb ' + server.hostname + ' (' + server.version + ')');
});

myDb.connect();

var tClient = new TwetterClient({
	consumer_key:         'KS3oiPniRCCsCghXho7VEg',
	consumer_secret:      'Gf2x9BFbB1mAn3JI8trKbc1ocyhIawaiWeOMvug9fw',
	access_token:         '601934980-ZPAlmG6hAsbmUizVlLgC84n2Misk8xnpAlPisvlj',
	access_token_secret:  '57TNRARQrIUOBViCUZlqgj5gVouvP418ySImln0RbHo',
});


var users = new Users(myDb, tClient);
var questions = new Questions(myDb, tClient);
var answers = new Answers(myDb, tClient);

var botName = 'roboQuiz'

function getCommand(tweet) {
	//console.log(JSON.stringify(tweet));
	if (tweet.event === 'follow') {
		console.log("New follow event. Adding new follower: "+tweet.source.screen_name);
		users.add(tweet.source.screen_name);
		return;
	}
	
	if (tweet.in_reply_to_screen_name === botName) {
		console.log("Got a mention from: "+tweet.user.screen_name);
		
		if (tweet.text.indexOf("!help") != -1) {
			tClient.sendDM(tweet.user.screen_name, 'Mention me with "!hitme" to have a question, reply to the question with the correct answer to score points.');
		}
		else if (tweet.text.indexOf("!hitme") != -1) {
			questions.publishRandom()
		}
		else {
			if (tweet.in_reply_to_status_id_str != null && tweet.in_reply_to_status_id_str != '') {
				var userAnswer = tweet.text.replace('@'+botName+' ', '');
				var thePlayer = tweet.user.screen_name;
				var questionTwRference = tweet.in_reply_to_status_id_str;
				answers.checkMatch(questionTwRference, userAnswer, function(response) {
					switch(response) {
						case 'ok':
							users.scorePoint(thePlayer, function (result) {
								console.log('answered OK userResult-> '+JSON.stringify(result));
							})
							questions.setAnswered(questionTwRference, function(result) {
								console.log('answered OK questionResult-> '+JSON.stringify(result));
							});
							break;
						case 'ko':
							console.log('wrong answert sent from '+ thePlayer);
							tClient.sendDM(thePlayer, 'Nope, guess again! [burst-'+(new Date().getTime())+']');
							break;
						case 'answered':
							console.log("Question already answered!");
								tClient.sendDM(thePlayer, 'Sorry someone already got these points, get another question and try aswering faster! :D');
							break;
					}
				});
			}
			else {
				console.log('Got a random mention: '+JSON.stringify(tweet));
			}
		}
	}
	else {
		console.log('Got a random mention: '+JSON.stringify(tweet));
	}
	
}

tClient.T.stream('user',[], function (stream) {
  stream.on('tweet', function (tweet) {
	getCommand(tweet)
  });
});