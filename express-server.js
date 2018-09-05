// views/express-server.js

// code dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// temp database of urls
let urlDatabase = {
    'b2xVn2': 'http://www.lighthouselabs.ca',
    '9sm5xK': 'http://www.google.com',
    'dx5gt2': 'http://www.reddit.com'
};

// home page
app.get('/', (req, res) => {
    res.render('urls-new');
});

// database of urls
app.get('/urls', (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render('urls-index', templateVars);
});

// new url form
app.get('/urls/new', (req, res) => {
    res.render('urls-new');
});

// render specific url
app.get('/urls/:id', (req, res) => {
    let templateVars = { shortURL: req.params.id, longURL: urlDatabase };
    res.render('urls-show', templateVars);
});

// edit existing url
app.post('/urls/:id', (req, res) => {
    let targetId = req.params.id;
    urlDatabase[targetId] = req.body.longURL;
    res.redirect('/urls');
});

// json
// app.get('/urls.json', (req, res) => {
//     res.json(urlDatabase);
// });

// redirect to actual url through short url
app.get('/u/:shortURL', (req, res) => {
    let longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});

// create new short url with form
app.post('/urls', (req, res) => {
    let tempShortUrl = generateRandomString();
    urlDatabase[tempShortUrl] = req.body.longURL;
    res.redirect(`/urls/${tempShortUrl}`);
});

// delete from database
app.post('/urls/:id/delete', (req, res) => {
    let targetId = req.params.id;
    delete urlDatabase[targetId];
    res.redirect('/urls');
});

// set up server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}:`);
});

// function to create random 6-char string for short url
function generateRandomString() {
    let rndString = '';
    rndString = Math.random().toString(36).substr(2, 6);
    return rndString;
}

