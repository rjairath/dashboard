import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://relaxed-llama-50954.upstash.io',
  token: process.env.REDIS_KEY,
})