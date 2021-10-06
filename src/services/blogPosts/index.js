import express from "express"
import createHttpError from "http-errors"

import BlogPostModel from "./schema.js"

const blogPostRouter = express.Router()

//---GET---

blogPostRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostModel.find()
    res.send(blogPosts)
  } catch (error) {
    next(error)
  }
})

//---GET:id---

blogPostRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const blogPost = await BlogPostModel.findById(blogId) // expects query as parameter

    if (blogPost) {
      res.send(blogPost)
    } else {
      next(createHttpError(404, `No BlogPost with id ${blogId} found!`))
    }
  } catch (error) {
    next(error)
  }
})

//---POST---

blogPostRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogPostModel(req.body) // validation of the req.body
    const { _id } = await newBlog.save() // interaction with the db/collection

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

//---PUT---

blogPostRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const modifiedBlogPost = await BlogPostModel.findByIdAndUpdate(blogId, req.body, {
      new: true, // returns the modified BlogPost
    })

    if (modifiedBlogPost) {
      res.send(modifiedBlogPost)
    } else {
      next(createHttpError(404, `No BlogPost with id ${blogId} found!`))
    }
  } catch (error) {
    next(error)
  }
})

//---DELETE---

blogPostRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const deletedBlogPost = await BlogPostModel.findByIdAndDelete(blogId)

    if (deletedBlogPost) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `No BlogPost with id ${blogId} found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default blogPostRouter