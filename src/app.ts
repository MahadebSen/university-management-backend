import express, { Application, Request, Response } from 'express'
import cors from 'cors'
// application routes
import router from './app/modules/users/users.route'

const app: Application = express()

// using cors
app.use(cors())

// parseing data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users', router)

// testing
app.get('/', async (req: Request, res: Response) => {
  res.send('Hii from University-management-backend')
})

export default app
