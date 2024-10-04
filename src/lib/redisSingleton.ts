import { createClient, RedisClientType } from "redis";

class RedisSingleton {
    private static instance: RedisSingleton | null = null;
    private redisClient: RedisClientType | null = null;

    private constructor() {
        console.log("Constructor called??")
        this.redisClient = createClient({
            socket: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT || "6379")
            },
            password: process.env.REDIS_PASSWORD
        });
        this.redisClient
            .connect()
            .then(() => console.log("Connected to Redis"))
            .catch((err) => console.error("Redis connection error:", err));
    }

    getClient() {
        if(!this.redisClient) {
            throw new Error("Redis client not initialised");
        }
        return this.redisClient;
    }

    static getInstance(): RedisSingleton {
        if(!RedisSingleton.instance) {
            RedisSingleton.instance = new RedisSingleton();
        }
        return RedisSingleton.instance;
    }
}

const redisSingleton = RedisSingleton.getInstance();
export default redisSingleton;