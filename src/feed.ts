import Parser from 'rss-parser'

import { getUrl, cacheUrl } from './database'

const rssParser = new Parser()

export const fetchFeeds = ({ urls }: { urls: string[] }): void => {
  urls.forEach(async (url) => {
    const feed = await rssParser.parseURL(url)

    feed.items.forEach((item) => {
      getUrl(item.link, async (_, row) => {
        if (row === undefined) {
          // TODO: insert many with array
          cacheUrl(item.link)
        }
      })
    })
  })
}
