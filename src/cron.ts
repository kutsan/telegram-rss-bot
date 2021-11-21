import { fetchAllFeeds, fetchNewFeeds } from './feed'
import { sendMessage } from './api'
import { getUrls } from './config'
import { cacheUrl, getAllFeeds, removeUrlById } from './database'

const urls = getUrls()

export const fetchJob = async (): Promise<void> => {
  const newFeeds = await fetchNewFeeds({ urls })

  for (const feed of newFeeds) {
    try {
      const response = await sendMessage(feed)

      if (response.ok) {
        cacheUrl(feed.link)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const clearOutdatedCachesJob = async (): Promise<void> => {
  const storedFeeds = getAllFeeds()

  if (storedFeeds.length === 0) {
    return
  }

  const currentLinks = (await fetchAllFeeds({ urls })).map(({ link }) => link)

  storedFeeds.forEach(({ id, url }) => {
    if (!currentLinks.includes(url)) {
      removeUrlById(id)
    }
  })
}
