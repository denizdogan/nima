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

const client = new Discord.Client()
const MODULES = [calc, convert, damp, ping, quote]

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
  const { author } = msg

  // ignore own messages
  if (author.id === client.user.id) {
    return
  }

  for (const module of MODULES) {
    module(msg)
  }
})

client.login(process.env.BOT_TOKEN)
