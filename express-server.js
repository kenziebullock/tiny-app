// views/express-server.js

// code dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const users = require('./data/users');
const app = express();
const index = require('./routes/index');

// middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// css file usage
app.use('/public', express.static('/public'));

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
//   res.render('error');
//   // next(err);
// });

module.exports = app;
