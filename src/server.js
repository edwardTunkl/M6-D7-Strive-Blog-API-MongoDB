import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'

import blogPostRouter from './services/blogPosts/index.js'

const port = process.env.PORT || 3001
const server = express()


server.use(cors())
server.use(express.json())

server.use("/blogPosts", blogPostRouter)



mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("CONNECTED", () => {
  console.log("CONNECTED TO MONGODB!!!!!!!!!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`RUNNING ON PORT: ${port}`)
  })
})

mongoose.connection.on("error", err => {
  console.log(err)
})