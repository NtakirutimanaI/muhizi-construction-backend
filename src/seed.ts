import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseSeeder } from './database/database.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seeder = app.get(DatabaseSeeder);

  try {
    console.log('🌱 Starting database seeding...\n');
    await seeder.seedCompanyProfile();
    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    process.exit(1);
  }

  await app.close();
  process.exit(0);
}

bootstrap();
