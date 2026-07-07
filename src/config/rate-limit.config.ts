export const RateLimitConfig = {
    auth: {
        windowMs: 60 * 1000,
        max: 100,
        message: 'Too many authentication attempts, please try again later',
    },
    global: {
        windowMs: 60 * 1000,
        max: 100,
        message: 'Too many requests, please try again later',
    },
    public: {
        windowMs: 60 * 1000,
        max: 30,
        message: 'Too many requests, please try again later',
    },
};
