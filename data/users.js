// data/users.js
// bcrypt
const bcrypt = require('bcrypt');

// users database
const users = {
  dude: {
    id: 'dude',
    email: 'dude@gmail.com',
    password: bcrypt.hashSync('mypass1', 10),
  },
  mark: {
    id: 'mark',
    email: 'mark@gmail.com',
    password: bcrypt.hashSync('markspass1', 10),
  },
  fred: {
    id: 'fred',
    email: 'fred@gmail.com',
    password: bcrypt.hashSync('fredspass1', 10),
  },
};

module.exports = users;
