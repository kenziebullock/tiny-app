// routes/routes.js
const express = require('express');
const bcrypt = require('bcrypt');
const users = require('../data/users');
const urlDatabase = require('../data/urls-database');

const router = express.Router();
let error = '';

// home page
router.get('/', (req, res) => {
  res.redirect('login');
});

// login page
router.get('/login', (req, res) => {
  const templateVars = {
    user_id: req.session.user_id,
    email: req.session.email,
    error: error,
  };
  error = '';
  if (req.session.user_id) {
    res.redirect('/urls');
  }
  res.render('login', templateVars);
});

// respond to login with a cookie
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const userArray = Object.values(users);
  const user = userArray.find(u => u.email === email);

  // error messages for incomplete form
  if (!email) {
    error = 'No email address entered!';
    res.redirect('/login');
  } else if (!password) {
    error = 'No password entered!';
    res.redirect('/login');
  }
  if (!user) {
    error = 'Incorrect login credentials!';
    res.redirect('/login');
  }

  // check password
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      // successful login
      req.session.email = user.email;
      req.session.user_id = user.id;
      res.redirect('/urls');
    } else {
      error = 'Incorrect login credentials!';
      res.redirect('/login');
    }
  });
});

// registration page
router.get('/register', (req, res) => {
  const templateVars = {
    user_id: req.session.user_id,
    email: req.session.email,
    error: error,
  };
  if (req.session.user_id) {
    res.redirect('/urls');
  }
  res.render('registration', templateVars);
});

// generate new user from registration with POST request
router.post('/register', (req, res) => {
  const userArray = Object.values(users);
  const user = userArray.find(u => u.email === req.body.email);

  // error handling
  if (!req.body.email) {
    error = 'No email address entered!';
    res.redirect('/register');
  } else if (!req.body.password) {
    error = 'No password entered!';
    res.redirect('/register');
  } else if (user) {
    error = 'User already exists with that email!';
    res.redirect('/register');
  }

  // new user is generated
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
    error: error,
  };
  error = '';
  if (req.session.user_id === undefined) {
    error = 'Not logged in!';
    res.redirect('/login');
  }
  res.render('urls-new', templateVars);
});

// database of urls
router.get('/urls', (req, res) => {
  error = '';
  const templateVars = {
    user_id: req.session.user_id,
    urls: urlDatabase,
    email: req.session.email,
    error: error,
  };
  if (req.session.user_id) {
    res.render('urls-index', templateVars);
  } else {
    error = 'Not logged in!';
    res.redirect('/login');
  }
});

// create new short url with form
router.post('/urls', (req, res) => {
  const tempShortUrl = generateRandomString();
  urlDatabase[tempShortUrl] = { longURL: req.body.longURL, user_id: req.session.user_id };
  res.redirect(`/urls/${tempShortUrl}`);
});

// render specific url (do you need all these variables?)
router.get('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  const user_id = req.session.user_id;
  if (!urlDatabase[shortURL]) {
    error = 'This short URL does not exist!';
    res.redirect('/urls');
  }
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    email: req.session.email,
    user_id: req.session.user_id,
    error: error,
  };
  

  if (user_id === urlDatabase[shortURL].user_id) {
    res.render('urls-show', templateVars);
  } else {
    error = 'Not authorized!';
    res.redirect('/urls');
  }
});

// edit existing url
router.post('/urls/:id', (req, res) => {
  const targetId = req.params.id;
  const user_id = req.session.user_id;
  urlDatabase[targetId] = { longURL: req.body.longURL, user_id: user_id };
  res.redirect('/urls');
});

// json (compass requirement)
router.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// redirect to actual url through short url
router.get('/u/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    error = 'This short URL does not exist!';
    res.redirect('/urls');
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// delete from database
router.post('/urls/:id/delete', (req, res) => {
  const targetId = req.params.id;
  delete urlDatabase[targetId];
  res.redirect('/urls');
});

// function to create random 6-char string for short url
function generateRandomString() {
  let rndString = '';
  rndString = Math.random().toString(36).substr(2, 6);
  return rndString;
}

module.exports = router;
