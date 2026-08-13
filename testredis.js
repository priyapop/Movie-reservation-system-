import redis from './config/redis.js';

async function test() {
  await redis.set('test-key', 'hello');
  const value = await redis.get('test-key');
  console.log('Value from Redis:', value);
  process.exit(0);
}

test();