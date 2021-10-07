import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'
import { notFound, badRequest, genericError } from './ErrorHandlers.js'
import blogPostRouter from './services/blogPosts/index.js'
import authorsRouter from './services/authors/index.js'

const port = process.env.PORT || 3001
const server = express()

//---Middlewares---

server.use(cors())
server.use(express.json())
//---Routes---
server.use("/blogPosts", blogPostRouter)
server.use("/authors", authorsRouter)
//---ErrorHandlers---

server.use(notFound)
server.use(badRequest)
server.use(genericError)

//------------------------

mongoose.connect(process.env.MONGO_CONNECTION,(err)=>{
  if(!err){
    console.log("CONNECTED TO MONGODB!!!!!!!!!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`RUNNING ON PORT: ${port}`)
  })
  }
  else{
    console.log("DB CONNECTION FAILED",error)
  }
})

 