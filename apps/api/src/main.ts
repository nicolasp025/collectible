import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { json } from 'express';
import { AppModule } from './app.module';
import { backfillThumbnails } from './item/backfill-thumbnails';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });
  app.use(cookieParser());
  app.use(json({ limit: '8mb' }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await backfillThumbnails(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
