import Redis from 'ioredis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));

export const holdSeatsScript = fs.readFileSync(
  path.join(__dirname, '../redis/holdSeats.lua'),
  'utf8'
);
// quick one-off cleanup, or just use different seat IDs for the next test


export default redis;