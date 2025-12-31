const redis = require("redis");

const client = redis.createClient({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

client.connect();

client.on("connect", () => console.log("Redis Connected"));
client.on("error", (err) => console.log("Redis Error:", err));

module.exports = client;
