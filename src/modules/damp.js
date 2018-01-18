const debug = require('debug')('nima:modules:damp')

module.exports = async function(msg) {
  const { content } = msg
  if (content.includes('damp')) {
    msg.channel.send('fuck detta livet ursäkta mitt språk men ibland får man damp')
  }
}
