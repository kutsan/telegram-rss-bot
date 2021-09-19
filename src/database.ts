import sqlite3 from 'sqlite3' // TODO: better-sqlite3

import { databasePath } from './config'

const db = new sqlite3.Database(databasePath)

export const initializeDatabase = () => {
  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS rss_items (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL)'
    )

    db.get('SELECT * FROM rss_items', (_, row) => {
      if (row === undefined) {
        // TODO: Initialize cache database.
      }
    })
  })
}

export const cacheUrl = (url: string): void => {
  db.prepare('INSERT INTO rss_items (url) VALUES (?)')
}
export const getUrl = (url: string): void => {
  db.prepare('SELECT * FROM rss_items WHERE url = ?')
}

export const clearOutdatesCaches = () => {}
