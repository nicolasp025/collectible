import { Logger } from '@nestjs/common';
import sharp from 'sharp';

const logger = new Logger('Thumbnail');

const THUMBNAIL_WIDTH = 500;

const DATA_URI_RE = /^data:([^;]+);base64,(.+)$/s;

export async function generateThumbnail(imageDataUri: string): Promise<string> {
  const match = DATA_URI_RE.exec(imageDataUri);
  if (!match) {
    return imageDataUri;
  }

  const buffer = Buffer.from(match[2], 'base64');
  const resized = await sharp(buffer)
    .resize({ width: THUMBNAIL_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return `data:image/webp;base64,${resized.toString('base64')}`;
}

// The uploaded "image" could be in a format sharp can't decode (corrupted
// file, exotic format that slipped past the browser's `accept="image/*"`).
// That shouldn't block saving the item itself — it just won't get a
// thumbnail, and the grid falls back to the full image in that case.
export async function generateThumbnailSafe(
  imageDataUri: string,
): Promise<string | null> {
  try {
    return await generateThumbnail(imageDataUri);
  } catch (err) {
    logger.warn(`Failed to generate thumbnail: ${(err as Error).message}`);
    return null;
  }
}
