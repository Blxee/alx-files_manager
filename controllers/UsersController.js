const dbClient = require('../utils/db');

exports.postNew = function postNew(req, res) {
  const user = req.body;

  if (!('email' in user)) {
    res.status(400).end('Missing email');
    return;
  }

  if (!('password' in user)) {
    res.status(400).end('Missing password');
    return;
  }

  dbClient.userExists(user.email)
    .then((res) => {
      if (dbClient.userExists(user.email)) {
        res.status(400).end('Already exist');
      } else {
        dbClient.createUser(user.email, user.password);
      }
    });
};

exports.getMe = function getMe() {

};
