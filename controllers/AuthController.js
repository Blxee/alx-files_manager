const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

exports.getConnect = function getConnect(req, res) {
  let auth = req.headers.authorization;
  auth = auth.replace('Basic ', '');
  auth = Buffer.from(auth, 'base64').toString();
  const [email, password] = auth.split(':');

  dbClient.getUser(email, password)
    .then((user) => {
      res.setHeader('Content-Type', 'application/json');

      if (user) {
        const token = uuidv4();
        redisClient.set(
          `auth_${token}`,
          JSON.stringify(user), // this may need to be changed
          24 * 60 * 60,
        );
        res.end(JSON.stringify({ token }));
      } else {
        res.status(401).end(JSON.stringify({ error: 'Unauthorized' }));
      }
    });
};

exports.getDisconnect = function getDisconnect(req, res) {
  const token = req.headers['x-token'];

  redisClient.get(`auth_${token}`)
    .then((user) => {
      if (user) {
        redisClient.del(`auth_${token}`);
        res.status(204).end();
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).end(JSON.stringify({ error: 'Unauthorized' }));
      }
    });
};
