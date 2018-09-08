// views/express-server.js

// code dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
// const path = require('path');
const users = require('./data/users');
const app = express();
const index = require('./routes/index');
// const session = require('express-session');
// const flash = require('req-flash');

// middleware
// app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  secret: 'something',
}));
// app.use(session({ secret: '234'}));
// app.use(flash());

// css file usage
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

// set up server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}:`);
});

// // respond to 404 'not found' error, then pass to error handler
// app.use((req, res, next) => {
//   let err = new Error('Nothing here!');
//   err.status = 404;
//   next(err);
// });

// // err handler
// app.use((err, req, res, next) => {
//   // renders error page
//   // console.log(err.stack);
//   res.status(err.status || 500);
//   //const errorz = res.status;
//   //console.log(errorz);
//   res.render('error', err);
//   // next(err);
// });

module.exports = app;
