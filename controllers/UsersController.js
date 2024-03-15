const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

exports.postNew = function postNew(req, res) {
  const user = req.body;

  res.setHeader('Content-Type', 'application/json');

  if (!('email' in user)) {
    res.status(400).end(JSON.stringify({ error: 'Missing email' }));
    return;
  }

  if (!('password' in user)) {
    res.status(400).end(JSON.stringify({ error: 'Missing password' }));
    return;
  }

  dbClient.userExists(user.email)
    .then((val) => {
      if (val) {
        res.status(400).end(JSON.stringify({ error: 'Already exist' }));
      } else {
        dbClient.createUser(user.email, user.password)
          .then((val2) => {
            res.status(201);
            res.end(JSON.stringify(val2));
          });
      }
    });
};

exports.getMe = async function getMe(req, res) {
  const token = req.headers['x-token'];

  const auth = await redisClient.get(`auth_${token}`);

  res.setHeader('Content-Type', 'application/json');

  if (auth) {
    const { _id: id, email } = JSON.parse(auth);
    res.end(JSON.stringify({ id, email }));
  } else {
    res.status(401).end(JSON.stringify({ error: 'Unauthorized' }));
  }
};
