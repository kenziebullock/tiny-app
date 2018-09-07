// routes/routes.js
const express = require('express');
const router = express.Router();
const users = require('../data/users');
const urlDatabase = require('../data/urls-database');
const bcrypt = require('bcrypt');

// home page
router.get('/', (req, res) => {
  res.redirect('login');
});

// login page
router.get('/login', (req, res) => {
  const templateVars = {
    user_id: req.session.user_id,
    email: req.session.email,
  };
  res.render('login', templateVars);
});

// respond to login with a cookie
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const userArray = Object.values(users);
  const user = userArray.find(u => u.email === email);

  if (!email) {
    res.redirect('/login');
  }
  if (!password) {
    res.redirect('/login');
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      // successful login
      req.session.email = user.email;
      req.session.user_id = user.id;
      res.redirect('/urls');
    } else {
      res.redirect('/login');
    }
  });
});

// registration page
router.get('/register', (req, res) => {
  const templateVars = {
    user_id: req.session.user_id,
    email: req.session.email,
  };
  res.render('registration', templateVars);
});

// generate new user from registration
router.post('/register', (req, res, next) => {
  const { email, password } = req.body;
  const userArray = Object.values(users);
  const user = userArray.find(u => u.email === email);

  if (user) {
    res.status(400);
    res.send('An account already exists with that email.')
  }
  if (!req.body.email) {
    res.status(400);
    res.send('No email address entered.');
    // res.redirect('/errors');
  } else if (!req.body.password) {
    res.status(400);
    res.send('No password entered.');
    // res.redirect('/errors');
  }

  const randomId = generateRandomString();
  users[randomId] = { id: randomId, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10) };
  req.session.user_id = users[randomId].id;
  req.session.email = req.body.email;
  res.redirect('/urls');
});

// logout
router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

// new url form
router.get('/urls/new', (req, res) => {
  const templateVars = {
    user_id: req.session.user_id,
    urls: urlDatabase,
    email: req.session.email,
  };
  if (req.session.user_id === undefined) {
    res.redirect('/login');
  }
  res.render('urls-new', templateVars);
});

// create new short url with form
router.post('/urls', (req, res) => {
  const tempShortUrl = generateRandomString();
  urlDatabase[tempShortUrl] = { longURL: req.body.longURL, user_id: req.session.user_id };
  res.redirect(`/urls/${tempShortUrl}`);
});

// database of urls
router.get('/urls', (req, res) => {
  const templateVars = {
    user_id: req.session.user_id,
    urls: urlDatabase,
    email: req.session.email,
  };
  res.render('urls-index', templateVars);
});


// render specific url (do you need all these variables?)
router.get('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    email: req.session.email,
    user_id: req.session.user_id,
  };
  res.render('urls-show', templateVars);
});

// edit existing url
router.post('/urls/:id', (req, res) => {
  const targetId = req.params.id;
  // const user_id = req.cookies.user_id;
  urlDatabase[targetId] = req.body.longURL;
  res.redirect('/urls', user_id);
});

// json (ERASE?)
// router.get('/urls.json', (req, res) => {
//     res.json(urlDatabase);
// });

// redirect to actual url through short url
router.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// delete from database
router.post('/urls/:id/delete', (req, res) => {
  const targetId = req.params.id;
  delete urlDatabase[targetId];
  res.redirect('/urls');
});

// error page
router.get('/errors', (req, res) => {
  res.render('error');
});

// function to create random 6-char string for short url
function generateRandomString() {
  let rndString = '';
  rndString = Math.random().toString(36).substr(2, 6);
  return rndString;
}

module.exports = router;
