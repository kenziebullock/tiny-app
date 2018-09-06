// views/express-server.js

// code dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

// middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// temp database of urls
const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

// home page
app.get('/', (req, res) => {
  const templateVars = { username: req.cookies.username };
  res.render('urls-new', templateVars);
});

// database of urls
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.username,
  };
  res.render('urls-index', templateVars);
});

// new url form
app.get('/urls/new', (req, res) => {
  res.render('urls-new');
});

// render specific url
app.get('/urls/:id', (req, res) => {
  const templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase,
    username: req.cookies.username,
  };
  res.render('urls-show', templateVars);
});

// edit existing url
app.post('/urls/:id', (req, res) => {
  const targetId = req.params.id;
  urlDatabase[targetId] = req.body.longURL;
  res.redirect('/urls');
});

// json
// app.get('/urls.json', (req, res) => {
//     res.json(urlDatabase);
// });

// redirect to actual url through short url
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// create new short url with form
app.post('/urls', (req, res) => {
  const tempShortUrl = generateRandomString();
  urlDatabase[tempShortUrl] = req.body.longURL;
  res.redirect(`/urls/${tempShortUrl}`);
});

// delete from database
app.post('/urls/:id/delete', (req, res) => {
  const targetId = req.params.id;
  delete urlDatabase[targetId];
  res.redirect('/urls');
});

// respond to login with a cookie
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
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
