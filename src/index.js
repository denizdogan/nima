require('@babel/polyfill')
require('dotenv-safe').load()

const debug = require('debug')('nima')
const parseInt = require('parse-int')
const Discord = require('discord.js')
const calc = require('./modules/calc')
const convert = require('./modules/convert')
const damp = require('./modules/damp')
const ping = require('./modules/ping')
const quote = require('./modules/quote')

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
