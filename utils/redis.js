import redis from 'redis';
import { promisify } from 'node:util';

class RedisClient {
  constructor() {
    this.alive = false;
    this.client = redis.createClient();
    this.client.on('error', redis.print);
    this.client.on('ready', () => {
      this.alive = true;
    });
  }

  isAlive() {
    return this.alive;
  }

  async get(key) {
    const get = promisify(this.client.get).bind(this.client);
    return get(key);
  }

  async set(key, value, duration) {
    const setex = promisify(this.client.setex).bind(this.client);
    return setex(key, duration, value);
  }

  async del(key) {
    const del = promisify(this.client.del).bind(this.client);
    return del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
