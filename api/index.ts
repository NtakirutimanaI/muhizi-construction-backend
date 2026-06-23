import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../dist/app.module';
import { setupApp } from '../dist/setup';
import express from 'express';

const server = express();
let cachedApp: express.Express;

async function bootstrap() {
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
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  cachedApp(req, res);
}
