const debug = require('debug')('nima:modules:convert')
import fetch from 'node-fetch'
import fx from 'money'
import logger from '../logger'
import Promise from 'bluebird'
import queryString from 'query-string'
import { stripIndents } from 'common-tags'

async function convertFiat(amount, base, target) {
  try {
    const qs = queryString.stringify({ base })
    const resp = await fetch(`https://api.fixer.io/latest?${qs}`)

    const data = await resp.json()
    const { error } = data
    if (error) {
      throw new Error(error)
    }

    fx.base = base
    fx.rates = data.rates
    const result = fx(amount)
      .from(base)
      .to(target)
    return result
  } catch (err) {
    throw err
  }
}

async function convertCrypto(amount, base, target) {
  try {
    const qs = queryString.stringify({ fsym: base, tsyms: target })
    const resp = await fetch(`https://min-api.cryptocompare.com/data/price?${qs}`)

    const data = await resp.json()
    const { Response, Error: error } = data
    if (Response === 'Error' && error) {
      throw new Error(error)
    }

    fx.base = base
    fx.rates = data
    const result = fx(amount)
      .from(base)
      .to(target)
    return result
  } catch (err) {
    throw err
  }
}

function replyUsage(msg) {
  msg.reply(stripIndents`
    Please use the format: !convert [amount] from to
    Examples:
    !convert 42 SEK USD
    !convert XRP BTC
  `)
}

export default async function(msg) {
  const [head, ...args] = msg.content.split(' ')
  if (head !== '!convert') {
    return
  }

  try {
    // get the arguments
    if (args.length !== 3 && args.length !== 2) {
      replyUsage(msg)
      return
    }

    // parse the arguments
    let amount
    let base
    let target
    if (args.length === 3) {
      amount = parseInt(args[0])
      base = args[1].toLocaleUpperCase()
      target = args[2].toLocaleUpperCase()
    } else if (args.length === 2) {
      amount = 1
      base = args[0].toLocaleUpperCase()
      target = args[1].toLocaleUpperCase()
    }

    // try to fetch fiat and crypto simultaneously
    const result = await Promise.any([
      convertFiat(amount, base, target),
      convertCrypto(amount, base, target)
    ])

    if (!result) {
      msg.reply('No idea, m8')
      return
    }

    msg.reply(`${amount} ${base} = ${result} ${target}`)
  } catch (err) {
    logger.error(err)
    replyUsage(msg)
  }
}
