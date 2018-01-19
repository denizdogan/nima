const debug = require('debug')('nima:modules:convert')
const fetch = require('node-fetch')
const fx = require('money')
const queryString = require('query-string')

async function convertFiat(amount, base, target) {
  try {
    const qs = queryString.stringify({ base })
    const resp = await fetch(`https://api.fixer.io/latest?${qs}`)
    const data = await resp.json()
    fx.base = base
    fx.rates = data.rates
    const result = fx(amount)
      .from(base)
      .to(target)
    return result
  } catch (err) {
    console.error(err)
    return undefined
  }
}

async function convertCrypto(amount, base, target) {
  try {
    const qs = queryString.stringify({ fsym: base, tsyms: target })
    const resp = await fetch(
      `https://min-api.cryptocompare.com/data/price?${qs}`
    )

    const data = await resp.json()
    if (data['Response'] === 'Error') {
      return undefined
    }

    fx.base = base
    fx.rates = data
    const result = fx(amount)
      .from(base)
      .to(target)
    return result
  } catch (err) {
    console.error(err)
    return undefined
  }
}

module.exports = async function(msg) {
  const { content } = msg
  if (!content.startsWith('!convert ')) {
    return
  }

  try {
    const parts = content.split(' ').slice(1)
    if (parts.length !== 3) {
      msg.reply('Please use the format: !convert 42 SEK USD')
      return
    }
    const amount = parseInt(parts[0])
    const base = parts[1].toLocaleUpperCase()
    const target = parts[2].toLocaleUpperCase()
    const result =
      (await convertFiat(amount, base, target)) ||
      (await convertCrypto(amount, base, target))
    if (!result) {
      msg.reply('No idea, m8')
    } else {
      msg.reply(`${amount} ${base} = ${result} ${target}`)
    }
  } catch (err) {
    console.error(err)
  }
}
