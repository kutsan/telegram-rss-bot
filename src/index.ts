import 'dotenv/config'
import { CronJob } from 'cron'

import { initializeDatabase } from './database'
import {
  validateConfig,
  makeDataFolders,
  fetchCronExpression,
  clearOutdatedCronExpression
} from './config'
import { fetchJob, clearOutdatedCachesJob } from './cron'

await initializeDatabase()
makeDataFolders()
validateConfig()

const fetchCronJob = new CronJob(fetchCronExpression, () => {
  fetchJob().catch(console.error)
})
fetchCronJob.start()

const clearOutdatedCronJob = new CronJob(clearOutdatedCronExpression, () => {
  clearOutdatedCachesJob().catch(console.error)
})
clearOutdatedCronJob.start()
