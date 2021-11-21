import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

import { isValidHttpUrl } from './utils'

const { CRON_EXPRESSION } = process.env

export const fetchCronExpression = CRON_EXPRESSION ?? '*/15 * * * *'
export const clearOutdatedCronExpression = '0 12 * * *'

const programFolderName = 'telegram-rss-bot'
const urlsFileName = 'urls.txt'
const databaseFileName = 'cache.db'

const userHome = os.homedir()
const xdgDataHome =
  process.env.XDG_DATA_HOME ?? path.join(userHome, '.local', 'share')
const xdgConfigHome =
  process.env.XDG_CONFIG_HOME ?? path.join(userHome, '.config')

const programDataHome = path.join(xdgDataHome, programFolderName)
const programConfigHome = path.join(xdgConfigHome, programFolderName)

export const makeDataFolders = (): void => {
  if (!fs.existsSync(programDataHome)) {
    fs.mkdirSync(programDataHome, { recursive: true })
  }

  if (!fs.existsSync(programConfigHome)) {
    fs.mkdirSync(programConfigHome, { recursive: true })
  }
}

export const urlsPath = path.join(programConfigHome, urlsFileName)
export const databasePath = path.join(programDataHome, databaseFileName)

export const getUrls = (): string[] => {
  return fs
    .readFileSync(urlsPath, 'utf-8')
    .split('\n')
    .filter((url) => url)
}

export const validateConfig = (): void => {
  if (!fs.existsSync(urlsPath)) {
    console.log(`${urlsPath} file is not found.`)
    process.exit(1)
  }

  const urls = getUrls()
  const invalidUrls = urls.filter((url) => !isValidHttpUrl(url))

  if (invalidUrls.length > 0) {
    console.log(
      [
        `Invalid URLs found in \`${urlsPath}\` file.`,
        `  ${invalidUrls.join('\n  ')}`
      ].join('\n')
    )
    process.exit(1)
  }

  if (urls.length < 1) {
    console.log(`There is no URL in \`${urlsPath}\` file.`)
    process.exit(1)
  }
}
