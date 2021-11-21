import fetch from 'node-fetch'
import { RateLimiter } from 'limiter'

const { API_TOKEN, CHANNEL_ID } = process.env

if (API_TOKEN === undefined) {
  console.log('Environment variable `API_TOKEN` does not exist.')
  process.exit(1)
}

if (CHANNEL_ID === undefined) {
  console.log('Environment variable `CHANNEL_ID` does not exist.')
  process.exit(1)
}

const telegramLimiter = new RateLimiter({
  tokensPerInterval: 1,
  interval: 3000
})

const apiUrl = new URL(`https://api.telegram.org/bot${API_TOKEN}/sendMessage`)
apiUrl.searchParams.set('chat_id', CHANNEL_ID)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const sendMessage = async ({
  title,
  link
}: {
  title: string
  link: string
}) => {
  await telegramLimiter.removeTokens(1)

  const sendUrl = new URL(apiUrl)
  sendUrl.searchParams.set('text', `${title}\n\n${link}`)

  return await fetch(sendUrl.toString())
}
