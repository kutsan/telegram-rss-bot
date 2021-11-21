import fetch from 'node-fetch'

const { API_TOKEN, CHANNEL_ID } = process.env

if (API_TOKEN === undefined) {
  console.log('Environment variable `API_TOKEN` does not exist.')
  process.exit(1)
}

if (CHANNEL_ID === undefined) {
  console.log('Environment variable `CHANNEL_ID` does not exist.')
  process.exit(1)
}

const apiUrl = new URL(`https://api.telegram.org/bot${API_TOKEN}/sendMessage`)
apiUrl.searchParams.set('chat_id', CHANNEL_ID)

// TODO: HTML format with content and other fields.
export const sendMessage = async ({ title, url }) => {
  const sendUrl = new URL(apiUrl)
  sendUrl.searchParams.set('text', url)

  return await fetch(sendUrl.toString())
}
