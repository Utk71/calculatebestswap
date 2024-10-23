const redis = require('redis');
const redisClient = redis.createClient();
redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});
(async () => {
    await redisClient.connect();

    async function getPoolReserve(poolName) {
        return new Promise((resolve, reject) => {
            redisClient.get(`raydium_pool_reserve_${poolName}`, (err, data) => {
                if (err) return reject(err);
                resolve(JSON.parse(data));
            });
        });
    }
    async function calculateSwapQuote(fromToken, toToken, amount) {
        try {
            const poolName = `${fromToken}_${toToken}`;
            const reserveData = await getPoolReserve(poolName);

            if (!reserveData) {
                console.log(`No reserve data found for pool ${poolName}`);
                return;
            }

            const { reserveIn, reserveOut } = reserveData;
            const amountOut = (reserveOut * amount) / (reserveIn + amount);
            console.log(`Swap quote: ${amountOut} ${toToken} for ${amount} ${fromToken}`);
        } catch (error) {
            console.error('Error calculating swap quote:', error);
        }
    }

 
    await calculateSwapQuote('ETH', 'USDC', 1);

    await redisClient.quit();
})();