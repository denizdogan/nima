require('dotenv-safe').load()

const debug = require('debug')('nima:modules:quote')
const fs = require('fs')
const path = require('path')
const parseInt = require('parse-int')
const commands = {
  '!qsearch': quoteSearch,
  '!addquote': addQuote,
  '!randquote': randQuote,
  '!quote': showQuote
}
module.exports = async function(msg) {
  const command = msg.content.split(' ')[0]
  const content = msg.content
    .split(' ')
    .slice(1)
    .join(' ')
  const func = commands[command]

  if (func) {
    func(msg, content)
  }
}

function addQuote(msg, quote) {
  const file = path.resolve(process.env.QUOTES_PATH, `${msg.guild.id}.json`)

  fs.readFile(file, (err, data) => {
    // Create new array of quotes if none exists
    const quotes = data === undefined ? [] : JSON.parse(data)
    quotes.push(quote)
    // Write json to file
    fs.writeFile(file, JSON.stringify(quotes), function(err) {
      if (err) throw err
    })
  })
}

function showQuote(msg, quoteId) {
  const file = path.resolve(process.env.QUOTES_PATH, `${msg.guild.id}.json`)
  quoteId = parseInt(quoteId)

  if (quoteId === undefined) {
    msg.reply('Please use the format: !quote quote-id')
    return
  }
  fs.readFile(file, (err, data) => {
    if (data === undefined) {
      msg.reply('No quotes found. Sorry!')
    } else {
      const quotes = JSON.parse(data)
      // Reply with quote
      if (quoteId >= quotes.length) {
        msg.reply(`There is no quote ${quoteId}`)
      } else {
        msg.reply(`Quote ${quoteId}\n${quotes[quoteId]}`)
      }
    }
  })
}

// Show a random quote
function randQuote(msg) {
  const file = path.resolve(process.env.QUOTES_PATH, `${msg.guild.id}.json`)

  fs.readFile(file, (err, data) => {
    if (data === undefined) {
      msg.reply('No quotes found. Sorry!')
    } else {
      const quotes = JSON.parse(data)
      // Reply with a random quote
      const n = Math.floor(Math.random() * quotes.length)
      msg.reply(`Quote ${n}\n${quotes[n]}`)
    }
  })
}

// Show a quote matching some key-phrase
function quoteSearch(msg, key) {
  const file = path.resolve(process.env.QUOTES_PATH, `${msg.guild.id}.json`)

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
