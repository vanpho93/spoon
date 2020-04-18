import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'

const app = express()

app.use(cors())
app.use(json())

app.get('/', (req, res) => res.send({ success: true }))

app.listen(3000, () => console.log('Server started.'))
