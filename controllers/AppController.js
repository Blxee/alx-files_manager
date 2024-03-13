const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

exports.getStatus = function getStatus(req, res) {
  const status = {
    redis: redisClient.isAlive(),
    db: dbClient.isAlive(),
  };
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.end(JSON.stringify(status));
};

exports.getStats = async function getStats(req, res) {
  const stats = {
    users: await dbClient.nbUsers(),
    files: await dbClient.nbFiles(),
  };
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.end(JSON.stringify(stats));
};
