const sqlTracker = () => {
    const originalQuery = require('pg').Client.prototype.query;

    const requestQueries = new WeakMap();

    require('pg').Client.prototype.query = function (...args) {
        const query = args[0];
        const params = args.length > 1 && Array.isArray(args[1]) ? args[1] : [];

        const req = global.currentRequest;

        if (req) {
            if (!requestQueries.has(req)) {
                requestQueries.set(req, []);
            }

            requestQueries.get(req).push({
                query: typeof query === 'string' ? query : query.text,
                params
            });
        }

        return originalQuery.apply(this, args);
    };

    return (req, res, next) => {
        global.currentRequest = req;

        requestQueries.set(req, []);

        const originalSend = res.send;

        res.send = function (body) {
            const queries = requestQueries.get(req) || [];

            res.set('X-SQL-Queries', JSON.stringify(queries));

            return originalSend.apply(this, arguments);
        };

        next();
    };
};

const responseInterceptor = (req, res, next) => {
    const originalSend = res.send

    res.send = function (body) {
        try {
            let data = body
            if (typeof body === "string") {
                try {
                    data = JSON.parse(body)
                } catch (e) {
                }
            }

            if (res.locals._sql && typeof data === "object") {
                const newBody = data

                return originalSend.call(this, newBody)
            }
        } catch (err) {
            console.error("Error in response interceptor:", err.message)
        }

        return originalSend.call(this, body)
    }

    next()
}

module.exports = { responseInterceptor, sqlTracker };
