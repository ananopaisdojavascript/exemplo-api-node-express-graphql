import express from 'express'
import cors from 'cors'
import winston from 'winston'
import { promises as fs } from 'fs'
import AccountRouter from './routes/account.router.js'

const { readFile, writeFile } = fs

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level} : ${message}`
})

global.fileName = "accounts.json"

global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "my-bank-api.log" })
    ],
    format: combine(
        label({ label: "my-bank-api" }),
        timestamp(),
        myFormat
    )
})

const app = express()
app.use(express.json())
app.use(cors())
const port = 3000

app.listen(port, async () => {
    try {
        await readFile(global.fileName)
        logger.info(`Servidor conectado`)
    } catch (error) {
        const inititalJson = {
            nextId: 1,
            accounts: []
        }
        writeFile(global.fileName, JSON.stringify(inititalJson)).then(() => {
            logger.info(`Servidor rodando na porta ${port}`)
        }).catch((error) => {
            logger.error(error)
        })
    }

})