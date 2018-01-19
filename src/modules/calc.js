const debug = require('debug')('nima:modules:calc')
import math from 'mathjs'

export default async function(msg) {
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
