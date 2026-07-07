import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup';
import { ExpressAdapter } from '@nestjs/platform-express';
import { patchExpressAdapter } from './custom-express.adapter';
import express from 'express';

const server = express();
let cachedApp: express.Express;

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
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  cachedApp(req, res);
}
