import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupApp } from './setup';
import { patchExpressAdapter } from './custom-express.adapter';

async function bootstrap() {
  patchExpressAdapter();
  const app = await NestFactory.create(AppModule);

  // Setup application (pipes, cors, swagger, etc.)
  setupApp(app);

  // Get config service
  const configService = app.get(ConfigService);

  // Get port from config
  const port = configService.get('PORT') || 3000;

  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`📡 WebSocket server is running on: ws://localhost:${port}`);
}
bootstrap();
