const debug = require('debug')('nima:modules:ping')

export default async function(msg) {
  const { content } = msg
  if (content === '!ping') {
    msg.reply('pong!')
  }
}
