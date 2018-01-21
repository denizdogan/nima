const debug = require('debug')('nima:modules:youtube')
import logger from '../logger'
import Promise from 'bluebird'
import youtubeSearch from 'youtube-search'

const promiseSearch = Promise.promisify(youtubeSearch)

export default async function(msg) {
  const [command, ...tail] = msg.content.split(' ')
  if (!['!youtube', '!yt'].includes(command)) {
    return
  }

  const query = tail.join(' ')

  try {
    const result = await promiseSearch(query, { key: process.env.YOUTUBE_API_KEY })
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
