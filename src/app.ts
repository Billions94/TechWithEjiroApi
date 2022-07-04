import express from 'express'
import listEndpoints from 'express-list-endpoints'
import checkAuthorization from './middleware/checkAuthorization'
import Routes from './routes'
import connect from './utils/connect'
import logger from './utils/logger'
import dotenv from 'dotenv'
dotenv.config();
import config from 'config'

const PORT = config.get<number>("port")

const app = express()

app.use(express.json())
app.use(checkAuthorization)

app.listen(PORT, async () => {
    logger.info(`App listening on http://localhost:${PORT}`)
    
    await connect()
    
    Routes(app)

    console.table(listEndpoints(app))
})