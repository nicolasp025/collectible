import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from './app.module';
import { backfillThumbnails } from './item/backfill-thumbnails';
import { migrateImageToImagesArray } from './item/migrate-images-array';
import { migrateReleaseDateToReleaseYear } from './item/migrate-release-year';

async function bootstrap() {
  const databasePath = process.env.DATABASE_PATH ?? 'inventory.sqlite';
  await migrateReleaseDateToReleaseYear(databasePath);
  await migrateImageToImagesArray(databasePath);
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(json({ limit: '8mb' }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await backfillThumbnails(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
