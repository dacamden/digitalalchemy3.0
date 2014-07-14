// code voor week3 challenge
// the original JSON tweetLog file is created manually
var Twit = require('twit'),
	fs = require('fs'),
	http = require('http'),
	store = "tweetLog.json",
	twitTrack = 'love';
var T = new Twit({
	consumer_key: 'xxxxxxxxx',
	consumer_secret: 'xxxxxx',
	access_token: 'xxxxxxxxxx',
	access_token_secret: 'xxxxxxxxxxxxxxxxxx'
})
var stream = T.stream('statuses/filter', {
	track: twitTrack
})
stream.on('tweet', function(raw) {
	if (raw.entities.media) {
		fs.readFile(store, function(err, data) {
			if (err) {
				console.log(err);
			}
			var tweet = { 
				name: raw.user.screen_name,
				url: raw.entities.media[0].media_url,
				date: raw.created_at
			};
			var object = JSON.parse(data);
			object.statuses.push(tweet);
			fs.writeFile(store, JSON.stringify(object, null, 4), function(err) {
				if (err) {
					console.log(err);
				} else {
					console.log("sombody tweeted " + twitTrack);
				}
			});
		});
	}
})
http.createServer(function(request, response) {
	fs.readFile(store, function read(err, data) {
		if (err) {
			throw err;
		}
		response.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*'
		});
		response.end(data);
	})
}).listen(process.env.PORT);