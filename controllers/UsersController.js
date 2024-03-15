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
    .then((val) => {
      if (val) {
        res.status(400).end('Already exist');
      } else {
        dbClient.createUser(user.email, user.password)
          .then((val2) => {
            res.status(201);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(val2));
          });
      }
    });
};

exports.getMe = function getMe() {

};
