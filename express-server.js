// views/express-server.js

// code dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const app = express();
const index = require('./routes/index');

// middleware

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  secret: 'something',
}));

// css file usage
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

// set up server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}:`);
});

module.exports = app;
