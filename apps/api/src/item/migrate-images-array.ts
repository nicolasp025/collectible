import { DataSource } from 'typeorm';

// Runs before the main TypeORM connection (and its `synchronize`) starts.
// `synchronize` only adds/drops columns to match the entities — without
// this step it would just drop the old `image` column, losing the photo.
// Safe to run on every boot: it's a no-op once `image` has been dropped.
export async function migrateImageToImagesArray(databasePath: string) {
  const dataSource = new DataSource({ type: 'sqlite', database: databasePath });
  await dataSource.initialize();
  try {
    const tables: { name: string }[] = await dataSource.query(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'item'`,
    );
    if (tables.length === 0) return;

    const columns: { name: string }[] = await dataSource.query(
      `PRAGMA table_info('item')`,
    );
    const columnNames = columns.map((c) => c.name);
    if (!columnNames.includes('image') || columnNames.includes('images')) {
      return;
    }

    await dataSource.query(`ALTER TABLE item ADD COLUMN images TEXT DEFAULT '[]'`);

    const rows: { id: string; image: string | null }[] = await dataSource.query(
      `SELECT id, image FROM item`,
    );
    for (const row of rows) {
      const images = row.image ? JSON.stringify([row.image]) : '[]';
      await dataSource.query(`UPDATE item SET images = ? WHERE id = ?`, [
        images,
        row.id,
      ]);
    }
  } finally {
    await dataSource.destroy();
  }
}
