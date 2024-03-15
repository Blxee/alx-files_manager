const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

exports.getConnect = async function getConnect(req, res) {
  let auth = req.headers.authorization;
  auth = auth.replace('Basic ', '');
  auth = Buffer.from(auth, 'base64').toString();
  const [email, password] = auth.split(':');

  res.setHeader('Content-Type', 'application/json');

  if (!email || !password) {
    return res.status(401).end(JSON.stringify({ error: 'Unauthorized' }));
  }

  const user = await dbClient.getUser(email, password);

  if (user == null) {
    return res.status(401).end(JSON.stringify({ error: 'Unauthorized' }));
  }

  const token = uuidv4();
  redisClient.set(
    `auth_${token}`,
    JSON.stringify(user), // this may need to be changed
    24 * 60 * 60,
  );
  return res.end(JSON.stringify({ token }));
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
