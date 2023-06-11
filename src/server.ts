import app from './app'
import mongoose from 'mongoose'
import config from './config/index'
import { successLogger, errorLogger } from './shared/logger'
import { Server } from 'http'

process.on('uncaughtException', error => {
  errorLogger.error(error)
  process.exit(1)
})

let server: Server

// database connection
async function dbFunction() {
  try {
    // db
    await mongoose.connect(config.database_url as string)
    // app
    server = app.listen(`${config.port}`, () => {
      successLogger.info(`Example app listening on port ${config.port}`)
    })
    // checking
    successLogger.info(`Successfully db is connected`)
  } catch (err) {
    errorLogger.error(err)
  }

  process.on('unhandledRejection', error => {
    // console.log('hii server closeing....')
    if (server) {
      server.close(() => {
        errorLogger.error(error)
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  })
}

dbFunction()

// Signal tarmination -----
process.on('SIGTERM', () => {
  successLogger.info('SIGTERM is received')
  if (server) {
    server.close()
  }
})
