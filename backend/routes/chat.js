import express from 'express'
import { sendChat } from '../controller/chatController.js'

const app = express.Router()


app.post('/',sendChat)



export default app