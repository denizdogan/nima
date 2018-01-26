const debug = require('debug')('nima:modules:youtube')
import logger from '../logger'
import Promise from 'bluebird'
import youtubeSearch from 'youtube-search'

const promiseSearch = Promise.promisify(youtubeSearch)

async function onMessage(msg) {
  const [command, ...tail] = msg.content.split(' ')
  if (!['!youtube', '!yt'].includes(command)) {
    return
  }

  const query = tail.join(' ')

  try {
    const result = await promiseSearch(query, { key: process.env.GOOGLE_API_KEY })
    if (!result.length) {
      msg.reply('no matches :(')
      return
    }
    const { title, link } = result[0]
    msg.reply(`${title}\n${link}`)
  } catch (err) {
    logger.error(err)
    msg.reply(err.message)
  }
}

export default function(client) {
  client.on('message', async msg => {
    // ignore own messages
    if (msg.author.id === client.user.id) {
      return
    }

    try {
      await onMessage(msg)
    } catch (err) {
      logger.error('An error occurred in a module', err)
    }
  })
}
