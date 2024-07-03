import { promisify } from 'util';
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.customer = createClient();
    this.isClientConnected = true;
    this.customer.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.customer.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  isAlive() {
    return this.isClientConnected;
  }

  async get(key) {
    return promisify(this.customer.GET).bind(this.customer)(key);
  }

  async set(key, value, duration) {
    await promisify(this.customer.SETEX)
      .bind(this.customer)(key, duration, value);
  }

  async del(key) {
    await promisify(this.customer.DEL).bind(this.customer)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
