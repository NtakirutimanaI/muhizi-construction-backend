const devOrigins = ['http://localhost:5173', 'http://localhost:5174'];

export const FrontendConfig = {
    url: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, ...devOrigins] : true,
    cors: {
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    }
};
