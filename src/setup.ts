import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json, urlencoded } from 'express';
import { FrontendConfig } from './config/frontend.config';
import { RateLimitConfig } from './config/rate-limit.config';

export function setupApp(app: INestApplication) {
    // Security headers
    app.use(helmet({
        contentSecurityPolicy: false,
    }));

    // Global rate limit
    app.use(rateLimit(RateLimitConfig.global));

    // Auth-specific rate limit (stricter for login/register)
    app.use('/auth', rateLimit(RateLimitConfig.auth));

    // Parse JSON with increased limit for image uploads
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));

    // Enable CORS
    app.enableCors({
        origin: FrontendConfig.url,
        ...FrontendConfig.cors,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Swagger Documentation (only in development)
    if (process.env.NODE_ENV !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('MUHIZI CONSTRUCTION API')
            .setDescription(
                `
      Complete company website management API for MUHIZI CONSTRUCTION.
      
      This API provides:
      - Public company portfolio viewing
      - Contact/messaging system
      - Profile management
      - Authentication & authorization
      
      **Public Endpoints** (No authentication required):
      - GET /profile/public - View complete company profile
      - POST /profile/contact - Send contact message
      
      **Protected Endpoints** (Require authentication):
      - All other profile, notification, and message management endpoints
    `,
            )
            .setVersion('1.0')
            .setContact(
                'MUHIZI CONSTRUCTION',
                'https://muhiziconstruction.rw',
                'info@muhiziconstruction.rw',
            )
            .addTag('Authentication', 'User authentication and login')
            .addTag('Profile', 'Portfolio and profile management')
            .addTag('Notifications', 'Notification management')
            .addTag('Public', 'Public endpoints (no auth required)')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token',
                    name: 'Authorization',
                    in: 'header',
                },
                'JWT-auth',
            )
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document, {
            customSiteTitle: 'MUHIZI CONSTRUCTION API Documentation',
            customCss: '.swagger-ui .topbar { display: none }',
            swaggerOptions: {
                persistAuthorization: true,
                docExpansion: 'none',
                filter: true,
                showRequestDuration: true,
            },
        });
    }
}
