# LIRI (Command line SIRI)

Node program that takes basic commands and replies with information retrieved from various APIs

## What this program is uCommands include nder the covers?

It's a simple command line program that takes in arguements to provide some basic data retrieved from online services. You can run the commands 
`concert-this`, `spotify-this-song`, `movie-this`, and `do-what-it-says`. To use this app you need to provide your own `.env` files with various API keys to get this program to work. Here is the layout of your `.env` program.

```
# Spotify Keys
SPOTIFY_ID=<your spotify ID>
SPOTIFY_SECRET=<your spotify secret>

# OMDB Key
OMDB_KEY=<your OMDB key>

# BandsInTown Key
BANDS_KEY=<your BandsInTown Key>
```

`concert-this` - Retrieves concert details of an artist from BandsInTown. Usage: `node liri.js concert-this <band-name>`

`spotify-this-song` - Retrieves the details of the song from the Spotify API, including song name, artist, album, and gives you the spotify link. Usage: `node liri.js spotify-this-song <song name>`

`movie-this` - Retrieves the details of a movie from the OMDB API. Usage `node liri.js movie-this <movie name>`

## Using this repository

This is a closed project on my end but anyone is free to fork the code and use it to their own will. 