import { createClient } from 'redis';
import log from "./logger"

const redisUrl = 'redis://localhost:6379';

const redisClient = createClient({
    url: redisUrl,
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        log.info('Redis client connected successfully');
        // redisClient.set('try', 'Welcome to Express and TypeScript with Prisma');
    } catch (error) {
        console.log(error);
        setTimeout(connectRedis, 5000);
    }
};

export default connectRedis;