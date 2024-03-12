import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export function getStatus(req, res) {
  const status = {
    redis: redisClient.isAlive(),
    db: dbClient.isAlive(),
  };
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.end(JSON.parse(status));
}

export async function getStats(req, res) {
  const stats = {
    users: await dbClient.nbUsers(),
    files: await dbClient.nbFiles(),
  };
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.end(JSON.parse(stats));
}
