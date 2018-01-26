const debug = require('debug')('nima:modules:quote')
import fs from 'fs-extra'
import logger from '../logger'
import parseInt from 'parse-int'
import path from 'path'
import randomItem from 'random-item'

const commands = {
  '!qsearch': quoteSearch,
  '!addquote': addQuote,
  '!randquote': randQuote,
  '!quote': showQuote
}

async function readQuotes(file) {
  // try to read the file, default to []
  try {
    return await fs.readJson(file)
  } catch (err) {
    if (err.code === 'ENOENT') {
      return []
    }
    throw err
  }
}

async function addQuote(msg, quote) {
  const file = path.resolve(process.env.QUOTES_DIRECTORY, `${msg.guild.id}.json`)

  // read the quotes
  const quotes = await readQuotes(file)

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
  const idx = quoteId - 1

  // try to read quotes
  const quotes = await readQuotes(file)
  if (!quotes.length) {
    msg.reply('No quotes found. Sorry!')
    return
  }

  // Reply with quote
  const quote = quotes[idx]
  if (quote) {
    msg.reply(`Quote ${quoteId}\n${quotes[idx]}`)
  } else {
    msg.reply(`There is no quote ${quoteId}`)
  }
}

// Show a random quote
async function randQuote(msg) {
  const file = path.resolve(process.env.QUOTES_DIRECTORY, `${msg.guild.id}.json`)

  // try to read quotes
  const quotes = await readQuotes(file)
  if (!quotes.length) {
    msg.reply('No quotes found. Sorry!')
    return
  }

  // Reply with a random quote
  const n = Math.floor(Math.random() * quotes.length)
  msg.reply(`Quote ${n + 1}\n${quotes[n]}`)
}

// Show a quote matching some key-phrase
async function quoteSearch(msg, query) {
  const file = path.resolve(process.env.QUOTES_DIRECTORY, `${msg.guild.id}.json`)

  // try to read quotes
  const quotes = await readQuotes(file)
  if (!quotes.length) {
    msg.reply('No quotes found. Sorry!')
    return
  }

  // filter the matching quotes
  const matches = quotes
    .map((quote, idx) => ({ quote, idx }))
    .filter(({ quote }) => quote.includes(query))
  if (!matches.length) {
    msg.reply('No matching quotes found.')
    return
  }

  // pick a random quote from the matches
  const { idx, quote } = randomItem(matches)
  msg.reply(`Quote ${idx + 1}\n${quote}`)
}

async function onMessage(msg) {
  const [command, ...tail] = msg.content.split(' ')
  const func = commands[command]

  if (func) {
    const content = tail.join(' ')
    try {
      await func(msg, content)
    } catch (err) {
      logger.error(err)
      msg.reply('An error occurred.')
    }
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
