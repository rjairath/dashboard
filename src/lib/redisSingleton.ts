import { createClient, RedisClientType } from "redis";

class RedisSingleton {
    static instance: RedisSingleton;
    private redisClient: RedisClientType | null = null;

    constructor() {
        // console.log(process.env.REDIS_URL_LOCAL, "checking")
        this.redisClient = createClient({
            url: process.env.REDIS_URL_LOCAL
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