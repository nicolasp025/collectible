import { DataSource } from 'typeorm';

export async function migrateReleaseDateToReleaseYear(databasePath: string) {
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
    if (!columnNames.includes('releaseDate') || columnNames.includes('releaseYear')) {
      return;
    }

    await dataSource.query(`ALTER TABLE item ADD COLUMN releaseYear INTEGER`);
    await dataSource.query(
      `UPDATE item SET releaseYear = CAST(substr(releaseDate, 1, 4) AS INTEGER) WHERE releaseDate IS NOT NULL`,
    );
  } finally {
    await dataSource.destroy();
  }
}
