import Parser from 'rss-parser'

import { getUrl } from './database'

const rssParser = new Parser()

type FeedItems = Array<{ title: string; link: string }>

export const fetchNewFeeds = async ({
  urls
}: {
  urls: string[]
}): Promise<FeedItems> => {
  return (
    await Promise.all(
      urls.map(async (url) => {
        const feed = await rssParser.parseURL(url)

        const newlyFetchedItems: FeedItems = feed.items
          .filter(({ link, title }) => {
            if (title === undefined || link === undefined) {
              return false
            }

            const url = getUrl(link)
            if (url === undefined) {
              return true
            }

            return false
          })
          .map(({ link, title }) => ({
            link,
            title
          })) as FeedItems

        return newlyFetchedItems
      })
    )
  ).flat()
}

export const fetchAllFeeds = async ({
  urls
}: {
  urls: string[]
}): Promise<FeedItems> => {
  return (
    await Promise.all(
      urls.map(async (url) => {
        const feed = await rssParser.parseURL(url)

        const fetchedItems: FeedItems = feed.items
          .filter(({ link, title }) => {
            if (title === undefined || link === undefined) {
              return false
            }

            return true
          })
          .map(({ link, title }) => ({
            link,
            title
          })) as FeedItems

        return fetchedItems
      })
    )
  ).flat()
}
