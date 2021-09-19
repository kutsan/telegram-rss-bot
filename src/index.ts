// TODO: pino

import dotenv from 'dotenv'
import { CronJob } from 'cron'

import { fetchFeeds } from './feed'
import { initializeDatabase, clearOutdatesCaches } from './database'
import {
  validateConfig,
  makeDataFolders,
  fetchCronExpression,
  clearOutdatedCronExpression
} from './config'

dotenv.config()

initializeDatabase()
makeDataFolders()
validateConfig()

const fetchJob = new CronJob(fetchCronExpression, () => {
  fetchFeeds
})
fetchJob.start()

const clearOutdatedJob = new CronJob(clearOutdatedCronExpression, () => {
  clearOutdatesCaches
})
clearOutdatedJob.start()
