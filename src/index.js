require('@babel/polyfill')
require('dotenv-safe').load()

const debug = require('debug')('nima')

import Discord from 'discord.js'
import logger from './logger'
import calc from './modules/calc'
import convert from './modules/convert'
import damp from './modules/damp'
import ping from './modules/ping'
import quote from './modules/quote'
import youtube from './modules/youtube'

const client = new Discord.Client()
const MODULES = [calc, convert, damp, ping, quote, youtube]

for (const init of MODULES) {
  init(client)
}

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.BOT_TOKEN)
