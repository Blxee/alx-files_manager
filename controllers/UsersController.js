import redisClient from "../utils/redis";
import dbClient from "../utils/db";

export function postNew(req, res) {
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
}

export function getMe() {

}
