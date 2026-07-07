const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

export const FrontendConfig = {
    url: isVercel ? process.env.FRONTEND_URL || true : process.env.FRONTEND_URL || true,
    cors: {
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    }
};
