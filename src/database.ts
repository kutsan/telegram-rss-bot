import Database from 'better-sqlite3'

import { fetchNewFeeds } from './feed'
import { databasePath, getUrls } from './config'

const db = new Database(databasePath)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getAllFeeds = () => {
  return db.prepare('SELECT * FROM rss_items').all()
}

export const initializeDatabase = async (): Promise<void> => {
  db.prepare(
    'CREATE TABLE IF NOT EXISTS rss_items (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL)'
  ).run()

  const rssItems = getAllFeeds()

  if (rssItems.length === 0) {
    const urls = getUrls()
    const newFeeds = await fetchNewFeeds({ urls })

    cacheUrls(newFeeds.map(({ link }) => link))
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const cacheUrls = (urls: string[]) => {
  const insertUrl = db.prepare('INSERT INTO rss_items (url) VALUES (?)')

  return db.transaction((links) => {
    for (const link of links) {
      insertUrl.run(link)
    }
  })(urls)
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const cacheUrl = (url: string) => {
  return db.prepare('INSERT INTO rss_items (url) VALUES (?)').run(url)
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getUrl = (url: string): void => {
  return db.prepare('SELECT * FROM rss_items WHERE url = ?').get(url)
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const removeUrlById = (id: string[]) => {
  return db.prepare('DELETE FROM rss_items WHERE id = ?').run(id)
}
