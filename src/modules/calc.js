const debug = require('debug')('nima:modules:calc')
const math = require('mathjs')

module.exports = async function(msg) {
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
