// routes/routes.js
const express = require('express');
const router = express.Router();
const users = require('../data/users');
const urlDatabase = require('../data/urls-database');
// const bcrypt = require('bcrypt');

// home page
router.get('/', (req, res) => {
  const templateVars = users;
  // console.log(templateVars);
  res.render('urls-new', users);
});

// login page
router.get('/login', (req, res) => {
  res.render('login');
});

// registration page
router.get('/register', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.username,
  };
  res.render('registration', templateVars);
});

// generate new user
router.post('/register', (req, res, next) => {
  if (!req.body.email) {
    res.redirect('/errors');
  } else if (!req.body.password) {
    res.redirect('/errors');
  }
  const randomId = generateRandomString();
  users[randomId] = { id: randomId, email: req.body.email, password: req.body.password };
  res.cookie('user_id', randomId);
  res.redirect('/urls');
});

// error page
router.get('/errors', (req, res) => {
  res.render('error');
});

// database of urls
router.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.username,
  };
  res.render('urls-index', templateVars);
});

// new url form
router.get('/urls/new', (req, res) => {
  res.render('urls-new');
});

// render specific url
router.get('/urls/:id', (req, res) => {
  const templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase,
    username: req.cookies.username,
  };
  res.render('urls-show', templateVars);
});

// edit existing url
router.post('/urls/:id', (req, res) => {
  const targetId = req.params.id;
  urlDatabase[targetId] = req.body.longURL;
  res.redirect('/urls');
});

// json
// router.get('/urls.json', (req, res) => {
//     res.json(urlDatabase);
// });

// redirect to actual url through short url
router.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// create new short url with form
router.post('/urls', (req, res) => {
  const tempShortUrl = generateRandomString();
  urlDatabase[tempShortUrl] = req.body.longURL;
  res.redirect(`/urls/${tempShortUrl}`);
});

// delete from database
router.post('/urls/:id/delete', (req, res) => {
  const targetId = req.params.id;
  delete urlDatabase[targetId];
  res.redirect('/urls');
});

// respond to login with a cookie
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const userArray = Object.values(users);
  const user = userArray.find(u => u.email === email);
  const pass = userArray.find(u => u.password === password)
  if (!user) {
    res.redirect('/login');
  }
  if (!pass) {
    res.redirect('/login');
  }

  // res.cookie('user_id', req.body.user_id);
  res.redirect('/');
});

router.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

// function to create random 6-char string for short url
function generateRandomString() {
  let rndString = '';
  rndString = Math.random().toString(36).substr(2, 6);
  return rndString;
}

module.exports = router;
