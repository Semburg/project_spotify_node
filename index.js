const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config()

const PORT = process.env.PORT || 5000

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://www.example.com/callback'
});


spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));




const app = express()
// console.log(data);
app.listen(5000, () => {
    console.log(`listening at http:localhost:${PORT}`);
})
app.use(express.static('public'))
app.set('view engine', 'ejs')
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse application/json
app.use(express.json())
app.get('/', (req, res) => {
    res.render('pages/index')
    //! IDs correct:
    // console.log(process.env.CLIENT_ID);
    // console.log(process.env.CLIENT_SECRET);

    // spotifyApi
    // .clientCredentialsGrant()
    // .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    // .catch(error => console.log('Something went wrong when retrieving an access token', error));
    // // data()
    // // console.log(data.body['access_token']);
})

app.get("/artist-search", (req, res) => {


    console.log("test")
    console.log(req.query)


    spotifyApi
        .searchArtists(req.query.searchName)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            //  res.json(data.body.artists.items[0].images[1].url)
            //  res.send(`the user search about  ${JSON.stringify(data.body.artists.items[0].images[1])}`)

            //!
            res.render('pages/artist-search-results',
                { data: data.body.artists.items,
                  imgAccessLink: data.body.artists.items[0].images[2].url    
                })


        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res) => {
    // res.send(`The ID is - ${req.params.id}`)
    let thisID = req.params.id;

    spotifyApi.getArtistAlbums(thisID).then(
        function (data) {


            //? tests
            //   res.json( data.body.items);

            //!  render
            res.render('pages/albums',
                { data: data.body.items })

        },
        function (err) {
            console.error(err);
        }
    );
})

app.get("/album/:id", (req, res) => {
    // res.send(`The ID is - ${req.params.id}`)

    let albumID = req.params.id;

    spotifyApi.getAlbum(albumID)
        .then(function (data) {
            // console.log('Album information', data.body);

            //? tests
            // res.json( data.body.tracks.items);

            //! render
            res.render('pages/album',
                { data: data.body.tracks.items })


        }, function (err) {
            console.error(err);
        });
})
