require('@babel/polyfill')
require('dotenv-safe').load()

const debug = require('debug')('nima')
import parseInt = require('parse-int')
import Discord = require('discord.js')
import calc = require('./modules/calc')
import convert = require('./modules/convert')
import damp = require('./modules/damp')
import ping = require('./modules/ping')
import quote = require('./modules/quote')


const client = new Discord.Client()
const MODULES = [calc, convert, damp, ping, quote]

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
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
