const debug = require('debug')('nima:modules:damp')
const moment = require('moment')

let lastTime = null
const MIN_TIME_DIFF = 60 // seconds

module.exports = async function(msg) {
  const { content } = msg
  if (content.includes('damp')) {
    // if never sent or sent more than MIN_TIME_DIFF seconds ago
    debug('lastTime = %s', lastTime)
    if (lastTime === null || moment().diff(lastTime, 'seconds', true) > MIN_TIME_DIFF) {
      msg.channel.send('fuck detta livet ursäkta mitt språk men ibland får man damp')
      debug('lastTime is now %s', lastTime)
      debug('diff is %s', moment().diff(lastTime, 'seconds', true))
      lastTime = moment.now()
    }
  }
}
