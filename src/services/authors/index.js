import express from "express";
import q2m from "query-to-mongo"; // Translates queries in browser into mongo readable queries (F**k yeah!!!)

import AuthorModel from "./schema.js";
import BlogPostModel from "./schema.js";
import { AuthorizationMiddleware } from "../authentication/basic.js";
import { JWTAuthenticate } from "../authentication/token.js";
import createHttpError from "http-errors";

const authorsRouter = express.Router();

//---Post(/login)---

authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const author = await AuthorModel.checkCredentials(email, password);
    
    if (author) {

      const accessToken = await JWTAuthenticate(author);
      res.send({ accessToken });

     } else {
       next(createHttpError(401, "Credentials are not ok!"));
      }
  } catch (error) {
    next(error);
  }
});

//---Get(me/stories)---

authorsRouter.get(
  "/me/stories",
  AuthorizationMiddleware,
  async (req, res, next) => {
    try {
      const posts = await BlogPostModel.find({
        author: req.user._id.toString(),
      });
      // console.log(req.user)
      res.status(200).send(posts);
    } catch (error) {
      next(error);
    }
  }
);

//---Get---

authorsRouter.get("/", AuthorizationMiddleware, async (req, res, next) => {
  try {
    const newQuery = q2m(req.query);
    const total = await AuthorModel.countDocuments(newQuery.criteria);
    const authors = await AuthorModel.find(
      newQuery.criteria,
      newQuery.options.fields
    )
      .limit(newQuery.options.limit || 20)
      .skip(newQuery.options.skip)
      .sort(newQuery.options.sort); // no matter how I write them but Mongo will always apply SORT then SKIP then LIMIT in this order
    res.send({
      links: newQuery.links("/authors", total),
      total,
      pageTotal: Math.ceil(total / newQuery.options.limit),
      authors,
    });
  } catch (error) {
    next(error);
  }
});

//---Get:id---

authorsRouter.get("/:authorId", AuthorizationMiddleware, async (req, res, next) => {
  try {
    const authorId = req.params.authorId;
    const author = await AuthorModel.findById(authorId); // expects query as parameter

    if (author) {
      res.send(author);
    } else {
      next(createHttpError(404, `No Author with id ${authorId} found!`));
    }
  } catch (error) {
    next(error);
  }
});

//---Post---

authorsRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body); // validation of the req.body
    const { _id } = await newAuthor.save(); // interaction with the db/collection

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

//---Put---

authorsRouter.put("/:authorId", AuthorizationMiddleware, async (req, res, next) => {
  try {
    const authorId = req.params.authorId;
    const modifiedAuthor = await AuthorModel.findByIdAndUpdate(
      authorId,
      req.body,
      {
        new: true, // returns the modified Author
      }
    );

    if (modifiedAuthor) {
      res.send(modifiedAuthor);
    } else {
      next(createHttpError(404, `No Author with id ${authorId} found!`));
    }
  } catch (error) {
    next(error);
  }
});

//---Delete---

authorsRouter.delete("/:authorId", AuthorizationMiddleware, async (req, res, next) => {
  try {
    const authorId = req.params.authorId;
    const deletedAuthor = await AuthorModel.findByIdAndDelete(authorId);

    if (deletedAuthor) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `No Author with id ${authorId} found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
