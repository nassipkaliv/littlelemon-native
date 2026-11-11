import * as SQLite from 'expo-sqlite';

let dbPromise = null;
const getDb = () => {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('little_lemon.db');
  return dbPromise;
};

export async function createTable() {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menuitems (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image TEXT,
      category TEXT
    );
  `);
}

export async function getMenuItems() {
  const db = await getDb();
  return db.getAllAsync('SELECT * FROM menuitems ORDER BY id');
}

export async function saveMenuItems(items) {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const item of items) {
      await db.runAsync(
        'INSERT INTO menuitems (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
        item.name,
        item.price,
        item.description,
        item.image,
        item.category
      );
    }
  });
}

/**
 * Returns menu items whose name contains `query` and whose category is one of
 * `categories`. An empty category list means "all categories".
 */
export async function filterByQueryAndCategories(query, categories) {
  const db = await getDb();
  const params = [`%${query}%`];
  let sql = 'SELECT * FROM menuitems WHERE name LIKE ?';
  if (categories.length > 0) {
    sql += ` AND category IN (${categories.map(() => '?').join(', ')})`;
    params.push(...categories.map((c) => c.toLowerCase()));
  }
  sql += ' ORDER BY id';
  return db.getAllAsync(sql, params);
}

export async function clearMenu() {
  const db = await getDb();
  await db.execAsync('DROP TABLE IF EXISTS menuitems;');
}
