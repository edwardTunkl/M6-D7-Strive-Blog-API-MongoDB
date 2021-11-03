import atob from "atob"
import createHttpError from "http-errors"
import AuthorModel from '../authors/schema.js'


export const AuthorizationMiddleware = async (req, res, next) => {
  console.log("THIS IS REQ HEADERS", req.headers)
  console.log("JWT_SECRET",process.env.JWT_SECRET)
  
  if (!req.headers.authorization) {
    next(createHttpError(401, "Please provide credentials in Authorization header"))
  } else {
    
    const decodedCredents = atob(req.headers.authorization.split(" ")[1])
    console.log(decodedCredents)

    const [email, password] = decodedCredents.split(":")
    console.log("THIS IS EMAIL ", email)
    console.log("THIS IS PASSWORD ", password)
    
    const user = await AuthorModel.checkCredentials(email, password)
    if (user) {
                                // if the credentials were ok => ....another middleware, route handler, etc
      req.user = user           // attaching to the request the user document
      next()
    } else {
                                // if problem with creds--> user is null
      next(createHttpError(401, "Credentials seem incorrect!"))
    }
 }
}