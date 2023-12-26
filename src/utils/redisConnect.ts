import { createClient } from 'redis';
import logger from "./logger"

const redisUrl = 'redis://localhost:6379';

const redisClient = createClient({
    url: redisUrl,
});

const connectRedis = async () => {
try {
    await redisClient.connect();
    logger.info('Redis client connect successfully');
    redisClient.set('try', 'Welcome to Express and TypeScript with Prisma');
} catch (error) {
    logger.error("could not connect");
    setTimeout(connectRedis, 5000);
}
};

connectRedis();

export default redisClient;