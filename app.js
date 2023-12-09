import express from 'express'
import cors from 'cors'
import winston from 'winston'
import { promises as fs } from 'fs'
import AccountRouter from './routes/account.router.js'
import { buildSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'
import AccountService from './services/account.service.js'
import Schema from './schema/index.js'


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

// const schema = buildSchema(`
//     type Account {
//         id: Int
//         name: String
//         balance: Float
//     }

//     input AccountInput {
//         id: Int
//         name: String
//         balance: Float
//     }

//     type Query {
//         getAccounts: [Account]
//         getAccount(id: Int): Account
//     }

//     type Mutation {
//         createAccount(account: AccountInput): Account
//         deleteAccount(id: Int): Boolean
//         updateAccount(account: AccountInput): Account
//     }
// `)

// const root = {
//     getAccounts: () => AccountService.getAccounts(),
//     getAccount(args) {
//         return AccountService.getAccountById(args.id)
//     },
//     createAccount({account}) {
//         return AccountService.createAccount(account)
//     },
//     deleteAccount(args) {
//         AccountService.deleteAccount(args.id)
//     },
//     updateAccount({account}) {
//         return AccountService.updateAccount(account)
//     }
// }

const app = express()
app.use(express.json())
app.use(cors())
app.use("/account", AccountRouter)
app.use("/graphql", graphqlHTTP({
    schema: Schema,
    // rootValue: root,
    graphiql: true
}))

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