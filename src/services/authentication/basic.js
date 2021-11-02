import atob from "atob"
import createHttpError from "http-errors"

import AuthorModel from '../authors/schema.js'

export const AuthorizationMiddleware = async (req, res, next) => {
  console.log("THIS IS REQ HEADERS", req.headers)

  if (!req.headers.authorization) {
    next(createHttpError(401, "Please provide credentials in Authorization header"))
  } else {
    const decodedCredents = atob(req.headers.authorization.split(" ")[1])
    console.log(decodedCredents)

    const [email, password] = decodedCredents.split(":")
    console.log("THIS IS EMAIL ", email)
    console.log("THIS IS PASSWORD ", password)

    // 3. Once we obtain plain credentials (diego@strive.com:1234), we need to find the user in db, compare received pw with the hashed one, if they are not ok --> trigger an error (401)

    const user = await AuthorModel.checkCredentials(email, password)
    if (user) {
      // if the credentials were ok we can proceed to what is next (another middleware, route handler)
      req.user = user // we are attaching to the request the user document
      next()
    } else {
      // if credentials problems --> user was null
      next(createHttpError(401, "Credentials seem incorrect!"))
    }
 }
}