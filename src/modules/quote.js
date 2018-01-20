require('dotenv-safe').load()

const debug = require('debug')('nima:modules:quote')
const fs = require('fs')
const parseInt = require('parse-int')
const commands = {
  '!qsearch': quoteSearch,
  '!addquote': addQuote,
  '!randquote': randQuote,
  '!quote': showQuote
}
module.exports = async function(msg) {
  const command = msg.content.split(' ')[0]
  const func = commands[command]
  if (func) {
    func(msg)
  }
}

function addQuote(msg) {
  const { content, guild } = msg
  const file = `${process.env.QUOTES_PATH}/${guild.id}.json`

  fs.readFile(file, (err, data) => {
    if (content.startsWith('!addquote ')) {
      const quote = content.replace('!addquote ', '')
      //Create new array of quotes if none exists
      const quotes = data === undefined ? [] : JSON.parse(data)
      quotes.push(quote)
      //Write json to file
      fs.writeFile(file, JSON.stringify(quotes), function(err) {
        if (err) throw err
      })
    }
  })
}
function showQuote(msg) {
  const { content, guild } = msg
  const file = `${process.env.QUOTES_PATH}/${guild.id}.json`
  const quoteId = parseInt(content.replace('!quote ', ''))
  if (quoteId === undefined) {
    msg.reply('Please use the format: !quote quote-id')
    return
  }
  fs.readFile(file, (err, data) => {
    if (data === undefined) {
      msg.reply('No quotes found. Sorry!')
    } else {
      const quotes = JSON.parse(data)
      //Reply with quote
      if (quoteId >= quotes.length) {
        msg.reply(`There is no quote ${quoteId}`)
      } else {
        msg.reply(`Quote ${quoteId}\n${quotes[quoteId]}`)
      }
    }
  })
}

//Show a random quote
function randQuote(msg) {
  const { guild } = msg
  const file = `${process.env.QUOTES_PATH}/${guild.id}.json`
  fs.readFile(file, (err, data) => {
    if (data === undefined) {
      msg.reply('No quotes found. Sorry!')
    } else {
      const quotes = JSON.parse(data)
      //Reply with a random quote
      const n = Math.floor(Math.random() * quotes.length)
      msg.reply(`Quote ${n}\n${quotes[n]}`)
    }
  })
}
//Show a quote matching some key-phrase
function quoteSearch(msg) {
  const { content, guild } = msg
  const file = `${process.env.QUOTES_PATH}/${guild.id}.json`
  fs.readFile(file, (err, data) => {
    const key = content.replace('!qsearch ', '')
    if (data === undefined) {
      console.log('asd')
      msg.reply('No quotes found.')
    } else {
      const quotes = JSON.parse(data)
      //Finding all matches (not necessary but might be useful in the future)
      let matches = []
      quotes.forEach((quote, index) => {
        if (quote.includes(key)) {
          matches.push(index)
        }
      })
      //Reply with the first matching quote
      if (!matches.length) {
        msg.reply('No quotes found.')
      } else {
        msg.reply(`Quote ${matches[0]}\n${quotes[matches[0]]}`)
      }
    }
  })
}
