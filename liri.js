//Import user keys from the .env provided by the user. 
require("dotenv").config();

//Stores the various API keys from the .env we imported above in a nice format
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");

function outputResponse(response) {
	console.log(response);

	fs.appendFile("logfile", response, function (err) { if (err) console.log(err); });
}

function bandsInTown(artist) {
	var apiURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bands.key;
	var response = "";

	axios.get(apiURL).then(function (res) {
		res.data.forEach(show => {
			var lineup = "";
			show.lineup.forEach(artist => {
				lineup += artist + "||"
			});

			//Using a slice to cut off the extra "||" from the above loop
			response += lineup.slice(0, -2) + "\n";

			response += "@ " + show.venue.name + " (" + show.venue.city + ", " + show.venue.region + ")" + "\n";
			response += moment(show.datetime).format("MM/DD/YYYY h:mm a") + "\n";
			response += "-----------" + "\n";
		});

		outputResponse(response);
	}, function (err) {
		console.log(err);
	});


}

function spotifySong(song) {
	var spot = new Spotify(keys.spotify);
	var response = "";

	spot.search({ type: "track", query: song, limit: 1 }).then(function (res) {
		var track = res.tracks.items[0];

		var artistLine = "";

		track.artists.forEach(artist => {
			artistLine += artist.name + " & ";
		});

		//cut off the final " & " from above loop
		artistLine = artistLine.slice(0, -3);

		response += track.name + " by " + artistLine + "\n";

		response += "From " + track.album.name + "\n";

		response += "Link: " + track.external_urls.spotif + "\n";

		outputResponse(response);
	}).catch(function (err) {
		console.log(err);
	});


}

function omdb(movie) {
	var apiURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.omdb.key;
	var response = "";

	axios.get(apiURL).then(function (res) {
		var movie = res.data;
		response += movie.Title + " (" + movie.Year + " in " + movie.Country + ")" + "\n";
		response += "================" + "\n";
		var ratingsLine = "";

		movie.Ratings.forEach(rating => {
			ratingsLine += rating.Source + ": " + rating.Value + " | ";
		});
		response += ratingsLine.slice(0, -2) + "\n";
		response += "Directed by " + movie.Director + "\n";
		response += "Authored by " + movie.Writer + "\n";
		response += "Starring: " + movie.Actors + "\n";

		response += movie.Plo + "\n";

		response += "Language: " + movie.Language + "\n";

		outputResponse(response);
	}, function (err) {
		console.log(err);
	});


}

function runCommand(command, argument) {

	switch (command) {
		case "concert-this":
			bandsInTown(argument);
			break;
		case "spotify-this-song":
			spotifySong(argument);
			break;
		case "movie-this":
			omdb(argument);
			break;
		case "do-what-it-says":

			break;
		default:
			command + " is not supported";
			break;
	}
}

var argument = "";

for (var i = 3; i < process.argv.length; i++) {
	argument += " " + process.argv[i];
}

runCommand(process.argv[2], argument.trim());