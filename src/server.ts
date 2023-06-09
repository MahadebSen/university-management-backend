import app from './app'
import mongoose from 'mongoose'
import config from './config/index'
import { successLogger, errorLogger } from './shared/logger'

// database connection
async function dbFunction() {
  try {
    // db
    await mongoose.connect(config.database_url as string)
    // app
    app.listen(`${config.port}`, () => {
      successLogger.info(`Example app listening on port ${config.port}`)
    })
    // checking
    successLogger.info(`Successfully db is connected`)
  } catch (err) {
    errorLogger.error(err)
  }
}

dbFunction()

/*
1. It is synchronous.
2. Performance issue.
3. Store logs by retantion.
4. Log depending on level.
5. Debug services.
*/
