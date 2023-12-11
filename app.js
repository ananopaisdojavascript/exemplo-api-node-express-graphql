import express from 'express'
import cors from 'cors'
import winston from 'winston'
import { promises as fs } from 'fs'
import AccountRouter from './routes/account.router.js'
import { graphqlHTTP } from 'express-graphql'
import Schema from './schema/index.js'
import basicAuth from "express-basic-auth"


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

function getRole(username) {
    if (username === "admin") {
        return "admin"
    } else if (username === "angelo") {
        return "role1"
    }
}

function authorize(...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1

    return (request, response, next) => {
        if (request.auth.user) {
            const role = getRole(request.auth.user)

            if (isAllowed(role)) {
                next()
            } else {
                response.status(401).send("Role not allowed!!")
            }
        } else {
            response.status(403).send("User not found!!!")
        }
    }
}

const app = express()
app.use(express.json())
app.use(cors())
// app.use(basicAuth({
//     users: { "admin": "admin" }
// }))

app.use(basicAuth({
    authorizer: (username, password) => {
        const userMatch = basicAuth.safeCompare(username, "admin")
        const passwordMatch = basicAuth.safeCompare(password, "admin")

        const user2Match = basicAuth.safeCompare(username, "angelo")
        const password2Match = basicAuth.safeCompare(password, "1234")

        return userMatch && passwordMatch || user2Match && password2Match
    }
}))

app.use("/account", authorize("admin", "role1"), AccountRouter)
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