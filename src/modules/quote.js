const debug = require('debug')('nima:modules:quote')
const fs = require('fs-extra')
const path = require('path')
const parseInt = require('parse-int')

const commands = {
  '!qsearch': quoteSearch,
  '!addquote': addQuote,
  '!randquote': randQuote,
  '!quote': showQuote
}

async function addQuote(msg, quote) {
  const file = path.resolve(process.env.QUOTES_DIRECTORY, `${msg.guild.id}.json`)

  // try to read the file, default to []
  let quotes
  try {
    quotes = await fs.readJson(file)
  } catch (err) {
    if (err.code === 'ENOENT') {
      quotes = []
    } else {
      throw err
    }
  }

  // add the quote to the array
  quotes.push(quote)

  // Write json to file
  try {
    await fs.outputJson(file, quotes)
  } catch (err) {
    throw err
  }
}

async function showQuote(msg, quoteId) {
  const file = path.resolve(process.env.QUOTES_DIRECTORY, `${msg.guild.id}.json`)

  // parse the ID as an integer
  quoteId = parseInt(quoteId)
  if (quoteId === undefined) {
    msg.reply('Please use the format: !quote quote-id')
    return
  }

  // try to read quotes
  let quotes
  try {
    quotes = await fs.readJson(file)
  } catch (err) {
    if (err.code === 'ENOENT') {
      msg.reply('No quotes found. Sorry!')
      return
    }
    throw err
  }

  // Reply with quote
  if (quoteId >= quotes.length) {
    msg.reply(`There is no quote ${quoteId}`)
  } else {
    msg.reply(`Quote ${quoteId}\n${quotes[quoteId]}`)
  }
}

// Show a random quote
async function randQuote(msg) {
  const file = path.resolve(process.env.QUOTES_DIRECTORY, `${msg.guild.id}.json`)

  // try to read quotes
  let quotes
  try {
    quotes = await fs.readJson(file)
  } catch (err) {
    if (err.code === 'ENOENT') {
      msg.reply('No quotes found. Sorry!')
      return
    }
    throw err
  }

  // Reply with a random quote
  const n = Math.floor(Math.random() * quotes.length)
  msg.reply(`Quote ${n}\n${quotes[n]}`)
}

// Show a quote matching some key-phrase
async function quoteSearch(msg, key) {
  const file = path.resolve(process.env.QUOTES_DIRECTORY, `${msg.guild.id}.json`)

  fs.readFile(file, (err, data) => {
    if (data === undefined) {
      msg.reply('No quotes found.')
    } else {
      const quotes = JSON.parse(data)
      // Finding all matches (not necessary but might be useful in the future)
      const matches = []
      quotes.forEach((quote, index) => {
        if (quote.includes(key)) {
          matches.push(index)
        }
      })
      // Reply with the first matching quote
      if (!matches.length) {
        msg.reply('No quotes found.')
      } else {
        msg.reply(`Quote ${matches[0]}\n${quotes[matches[0]]}`)
      }
    }
  })
}

export default async function(msg) {
  const [command, ...tail] = msg.content.split(' ')
  const func = commands[command]

  if (func) {
    const content = tail.join(' ')
    await func(msg, content)
  }
}
