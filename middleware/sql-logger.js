const sqlLogger = (client) => {
    const originalQuery = client.query.bind(client);

    return (req, res, next) => {
        req.sqlQueries = [];

        client.query = (...args) => {
            const query = args[0];
            const params = args.length > 1 ? args[1] : [];

            const sqlInfo = {
                query: typeof query === "string" ? query : query.text || "Unknown query",
                params: params || [],
                duration: null,
            };

            const result = originalQuery(...args);
    
            const startTime = performance.now();
            result.then(() => {
                const endTime = performance.now();
                sqlInfo.duration = endTime - startTime;  
            }).catch(() => {
                const endTime = performance.now();
                sqlInfo.duration = endTime - startTime; 
            });

            req.sqlQueries.push(sqlInfo);

            return result;
        };

        const originalSend = res.send;

        res.send = function (body) {
            res.set('X-SQL-Queries', JSON.stringify(req.sqlQueries));

            return originalSend.call(this, body);
        };

        next();
    };
};

module.exports = sqlLogger;
