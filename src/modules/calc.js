const debug = require('debug')('nima:modules:calc')
import math from 'mathjs'

async function onMessage(msg) {
  const { content } = msg
  if (!content.startsWith('!calc ')) {
    return
  }

  const expr = content
    .split(' ')
    .slice(1)
    .join(' ')
  try {
    const result = math.eval(expr)
    msg.reply(`${expr} = ${result}`)
  } catch (err) {
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
