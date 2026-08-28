import { INestApplicationContext, Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { generateThumbnailSafe } from '../common/thumbnail';

const logger = new Logger('ThumbnailBackfill');

// Generates thumbnails for items whose images[0] predates the thumbnail
// column, or that lost their thumbnail some other way. Safe to run on
// every boot: only touches rows still missing a thumbnail, so it's a
// no-op once everything has been migrated (items whose image sharp can't
// decode are simply retried, harmlessly, on every future boot).
export async function backfillThumbnails(app: INestApplicationContext) {
  const itemsRepository = app.get<Repository<Item>>(getRepositoryToken(Item));
  const items = await itemsRepository.find({
    where: { thumbnail: IsNull() },
  });

  let migrated = 0;
  for (const item of items) {
    if (!item.images[0]) continue;
    const thumbnail = await generateThumbnailSafe(item.images[0]);
    if (thumbnail) {
      item.thumbnail = thumbnail;
      await itemsRepository.save(item);
      migrated++;
    }
  }

  if (migrated > 0) {
    logger.log(`Generated thumbnails for ${migrated} existing item(s).`);
  }
}
