const redisClient = require('../utils/redis');
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

  redisClient.get();
};

exports.getMe = function getMe() {

};
