import express from "express"
import q2m from "query-to-mongo" // Translates queries in browser into mongo readable queries (F**k yeah!!!)

import AuthorModel from './schema.js'

const authorsRouter = express.Router()

//---Get---

authorsRouter.get("/", async(req, res, next) =>{
  try {
    const newQuery = q2m(req.query)
    const total = await AuthorModel.countDocuments(newQuery.criteria)
    const authors = await AuthorModel.find(newQuery.criteria, newQuery.options.fields)
      .limit(newQuery.options.limit || 20)
      .skip(newQuery.options.skip)
      .sort(newQuery.options.sort) // no matter how I write them but Mongo will always apply SORT then SKIP then LIMIT in this order
    res.send({ links: newQuery.links("/authors", total), total, pageTotal: Math.ceil(total / newQuery.options.limit), authors })
  } catch (error) {
    next(error)
  }
})

//---Get:id---

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const authorId = req.params.authorId
    const author = await AuthorModel.findById(authorId) // expects query as parameter

    if (author) {
      res.send(author)
    } else {
      next(createHttpError(404, `No Author with id ${authorId} found!`))
    }
  } catch (error) {
    next(error)
  }
})

//---Post---

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body) // validation of the req.body
    const { _id } = await newAuthor.save() // interaction with the db/collection

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

//---Put---

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const authorId = req.params.authorId
    const modifiedAuthor = await AuthorModel.findByIdAndUpdate(authorId, req.body, {
      new: true, // returns the modified Author
    })

    if (modifiedAuthor) {
      res.send(modifiedAuthor)
    } else {
      next(createHttpError(404, `No Author with id ${authorId} found!`))
    }
  } catch (error) {
    next(error)
  }
})

//---Delete---

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const authorId = req.params.authorId
    const deletedAuthor = await AuthorModel.findByIdAndDelete(authorId)

    if (deletedAuthor) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `No Author with id ${authorId} found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default authorsRouter