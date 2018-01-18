const debug = require('debug')('nima:modules:ping')

module.exports = async function(msg) {
  const { content } = msg
  if (content === '!ping') {
    msg.reply('pong!')
  }
}
