import { URL } from 'node:url'

export const isValidHttpUrl = (url: string): boolean => {
  let urlInstance: URL

  try {
    urlInstance = new URL(url)
  } catch (error) {
    return false
  }

  return urlInstance.protocol === 'http:' || urlInstance.protocol === 'https:'
}
