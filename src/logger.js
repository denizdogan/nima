import winston from 'winston'

const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug'

const logger = winston.createLogger({
  level,
  format: winston.format.json(),
  transports: []
})

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ filename: 'nima.log' }))
} else {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }))
}

export default logger
