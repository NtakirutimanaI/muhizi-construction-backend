// TEMPORARY: allow all origins to unblock testing. Tighten back to an allowlist afterward.
export const FrontendConfig = {
    cors: {
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        origin: true,
    },
};
