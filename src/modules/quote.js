const debug = require('debug')('nima:modules:quote')
import fs from 'fs-extra'
import logger from '../logger'
import randomItem from 'random-item'
import parseInt from 'parse-int'
import { stripIndents } from 'common-tags'
import { naturalDay } from 'humanize'

/**
 * Quote container providing convenience methods for easily interacting with the database.
 * @class
 */
class QuoteContainer {
  /**
   * Mapping between guild ID as a string and its list of quotes.
   *
   * {
   *   "405121502231321801": [
   *     {
   *       "user": "foobar#1234",
   *       "date": "2012-04-23T18:25:43.511Z",
   *       "text": "loool"
   *     }
   *   ],
   *   ...
   * }
   *
   * @private
   */
  quotes = {}

  /**
   * Load the database from disk.
   * @throws Will throw an error if an error occurred
   */
  async load() {
    try {
      this.quotes = await fs.readJson(process.env.QUOTES_FILE_PATH)
    } catch (err) {
      // ENOENT is expected, it means the file doesn't exist (yet)
      if (err.code !== 'ENOENT') {
        throw err
      }
    }
  }

  /**
   * Write the database to disk.
   * @throws Will throw an error if an error occurred
   * @private
   */
  async save() {
    try {
      await fs.writeJSON(process.env.QUOTES_FILE_PATH, this.quotes)
    } catch (err) {
      throw err
    }
  }

  /**
   * Add a quote to the database.
   * @param {string} guild Guild ID
   * @param {string} user Username
   * @param {string} text The quote
   * @throws Will throw an error if an error occurred
   * @public
   */
  async add(guild, user, text) {
    if (!this.quotes.hasOwnProperty(guild)) {
      this.quotes[guild] = []
    }
    try {
      this.quotes[guild].push({
        user,
        date: new Date().toJSON(),
        text
      })
      this.save() // TODO: await?
    } catch (err) {
      throw err
    }
  }

  /**
   * Return a randomly selected quote which includes the given search string.
   * If not quote includes the search string, return null.
   * @param {string} guild Guild ID
   * @param {string} text Search string
   * @returns {?object} A matching quote and its index or null
   * @public
   */
  search(guild, text) {
    const quotes = this.quotes[guild] || []
    const matching = quotes
      .map((quote, idx) => ({ quote, idx }))
      .filter(({ quote }) => quote.text.includes(text))
    if (!matching.length) {
      return null
    }
    return randomItem(matching)
  }

  /**
   * Return a quote given its index in the database.
   * If no such quote exists, return null.
   * @param {string} guild Guild ID
   * @param {number} idx Index of the quote
   * @returns {?object} The quote or null
   */
  get(guild, idx) {
    const quotes = this.quotes[guild] || []
    return quotes[idx] || null
  }

  /**
   * Get the number of quotes stored for the given guild.
   * @param {string} guild Guild ID
   * @returns {number} The number of quotes stored for the given guild
   */
  size(guild) {
    const quotes = this.quotes[guild] || []
    return quotes.length
  }
}

const quotes = new QuoteContainer()
quotes.load().then(
  () => {
    logger.debug('Successfully loaded quotes')
  },
  reason => {
    logger.error(reason)
  }
)

function add(msg, quote) {
  return quotes.add(msg.guild.id, msg.author.tag, quote)
}

async function show(msg, quoteId) {
  try {
    // if no argument given, show a random quote
    if (quoteId === '') {
      await randQuote(msg)
      return
    }

    // the index of the quote is (quoteId - 1)
    const match = await quotes.get(msg.guild.id, quoteId - 1)
    if (!match) {
      msg.reply(`There is no quote ${quoteId}`)
      return
    }

    const date = naturalDay(new Date(match.date).getTime() / 1000)
    msg.reply(stripIndents`
      Quote ${quoteId} (added by ${match.user} @ ${date})
      ${match.text}
    `)
  } catch (err) {
    throw err
  }
}

// Show a quote matching some key-phrase
async function search(msg, query) {
  const match = await quotes.search(msg.guild.id, query)
  if (!match) {
    msg.reply('No matching quotes found.')
    return
  }

  const { idx, quote } = match
  const date = naturalDay(new Date(quote.date).getTime() / 1000)
  msg.reply(stripIndents`
    Quote ${idx + 1} (added by ${quote.user} @ ${date})
    ${quote.text}
  `)
}

function onMessage(msg) {
  const [command, ...tail] = msg.content.split(' ')

  // check if it's the !addquote command
  if (command === '!addquote') {
    const content = tail.join(' ')
    return add(msg, content)
  }

  // if it's not !quote, don't do anything
  if (command !== '!quote') {
    return
  }

  // if no argument was given, show a random quote
  if (!tail.length) {
    return search(msg, '')
  }

  // if an integer argument was given, that's a quote ID
  const integer = parseInt(tail[0])
  if (integer !== undefined) {
    return show(msg, integer)
  }

  // otherwise, it's a search
  const content = tail.join(' ')
  return search(msg, content)
}

export default function(client) {
  client.on('message', async msg => {
    // ignore own messages
    if (msg.author.id === client.user.id) {
      return
    }

    try {
      await Promise.resolve(onMessage(msg))
    } catch (err) {
      throw err
    }
  })
}
