const debug = require('debug')('nima:modules:ping')

async function onMessage(msg) {
  const { content } = msg
  if (content === '!ping') {
    msg.reply('pong!')
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
