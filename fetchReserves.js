const redis = require('redis');
const axios = require('axios'); 
const url = 'https://api.raydium.io/pairs'

const redisClient = redis.createClient();
redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});

async function fetchPools() {
    try {
        const response = await axios.get(url); 
        if (response.data) {
            const pools = response.data;
            console.log(pools);

            pools.forEach(pool => {
                const key = `raydium_pool_reserve_${pool.name}`;
                redisClient.set(key, JSON.stringify(pool), 'EX', 60 * 30); 
            });
            console.log('Pool reserves updated.');
        }
    } catch (error) {
        console.error('Error fetching pools:', error);
    }
}
setInterval(fetchPools, 60000);
fetchPools();

