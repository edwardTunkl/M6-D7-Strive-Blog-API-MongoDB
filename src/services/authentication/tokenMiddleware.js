import { verifyJWT } from "../authentication/token.js";
import createHttpError from "http-errors";
import AuthorModel from "../authors/schema.js"
 
export const tokenMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(401, "Please provide credentials in Authorization header")
    );
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");

      const decodedToken = await verifyJWT(token);
      console.log("DECODED TOKEN ", decodedToken);

      const user = await AuthorModel.findById(decodedToken._id);

      if (user) {
        req.user = user;
        next();
      } else {
        next(createHttpError(404, "No user found!"));
      }
    } catch (error) {
      next(createHttpError(401, "Token seems not correct!"));
    }
  }
};