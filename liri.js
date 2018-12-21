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

	fs.appendFile("logfile", response + "\n", function (err) { if (err) console.log(err); });
}

function bandsInTown(artist) {
	if (artist == "") {
		artist = "Youth Code";
		outputResponse("Defaulting to " + artist + " as no artist was provided\n");
	}

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

		outputResponse(response.slice(0, -1));
	}, function (err) {
		console.log(err);
	});


}

function spotifySong(song) {
	if (song === "") {
		song = "The Sign Ace of Base";
		outputResponse("Defaulting to " + song + " as no song was provided")
	}

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

		response += "Link: " + track.external_urls.spotify;

		outputResponse(response);
	}).catch(function (err) {
		console.log(err);
	});


}

function omdb(movie) {
	if (movie === "") {
		movie = "Mr. Nobody";
		outputResponse("Defaulting to " + movie + " as no movie was given")
	}

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

		response += "Language: " + movie.Language;

		outputResponse(response);
	}, function (err) {
		console.log(err);
	});
}

function fileCommand() {
	fs.readFile("random.txt", "utf8", function (err, data) {
		if (err) {
			console.log(err);
		} else {
			var command = data.split(",");

			if (command[0] === "do-what-it-says") {
				outputResponse("I ain't gonna fall for an infinite do-what-it-says loop. Nice Try");
			}

			runCommand(command[0], command[1].slice(1, -1));
		}
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
			fileCommand();
			break;
		default:
			outputResponse(command + " is not supported");
			break;
	}
}

var argument = "";

for (var i = 3; i < process.argv.length; i++) {
	argument += " " + process.argv[i];
}

fs.appendFile("logfile", "[[" + process.argv[2] + " " + argument + "]]\n", function (err) { if (err) console.log(err); });


runCommand(process.argv[2], argument.trim());