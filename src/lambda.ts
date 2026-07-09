import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup';
import { ExpressAdapter } from '@nestjs/platform-express';
import { patchExpressAdapter } from './custom-express.adapter';
import express from 'express';

const server = express();
let cachedApp: express.Express;
let bootstrapError: Error | null = null;

async function bootstrap() {
  patchExpressAdapter();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  setupApp(app);
  await app.init();

  return server;
}

export default async function handler(
  req: any,
  res: any,
) {
  if (bootstrapError) {
    res.status(500).json({
      statusCode: 500,
      message: 'Server failed to initialize',
      error: process.env.NODE_ENV !== 'production' ? bootstrapError.message : undefined,
    });
    return;
  }

  if (!cachedApp) {
    try {
      cachedApp = await bootstrap();
    } catch (error) {
      bootstrapError = error;
      console.error('Lambda bootstrap failed:', error);
      res.status(500).json({
        statusCode: 500,
        message: 'Server failed to initialize',
        error: process.env.NODE_ENV !== 'production' ? error.message : undefined,
      });
      return;
    }
  }
  cachedApp(req, res);
}
