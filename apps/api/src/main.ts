import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from './app.module';
import { migrateReleaseDateToReleaseYear } from './item/migrate-release-year';

async function bootstrap() {
  await migrateReleaseDateToReleaseYear(process.env.DATABASE_PATH ?? 'inventory.sqlite');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(json({ limit: '8mb' }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
