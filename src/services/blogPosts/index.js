import express from "express"
import createHttpError from "http-errors"
import q2m from "query-to-mongo"
import BlogPostModel from "./schema.js"
import CommentModel from '../comments/schema.js'
const blogPostRouter = express.Router()

//---GET---

blogPostRouter.get("/", async (req, res, next) => {
  try {
    const Query = q2m(req.query)
    const total = await BlogPostModel.countDocuments(Query.criteria)
    const books = await BlogPostModel.find(Query.criteria, Query.options.fields)
      .limit(Query.options.limit || 4)
      .skip(Query.options.skip)
      .sort(Query.options.sort)

    res.send(blogPosts, { links: Query.links("/", total), total, pageTotal: Math.ceil(total / Query.options.limit)})
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

//---COMMENTS---

//---POST---

blogPostRouter.post("/:blogId/comments", async(req, res, next) => {

try {
  const newComment = new CommentModel(req.body.comment)

  const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(req.params.blogId, {$push: {comments: newComment}}, {new:true})
  if(updatedBlogPost){
    res.send(updatedBlogPost)
  }else {
    next(createHttpError(404, `Blog with Id: ${req.params.blogId} not found!`))
  }
} catch (error) {
  next(error)
}
})

//---GET---

blogPostRouter.get("/:blogId/comments", async(req, res, next)=>{
  try {
    const blogPost = await BlogPostModel.findById(req.params.blogId)
    
    if(blogPost){
      res.send(blogPost.comments)
    } else {
      next(createHttpError(404, `BlogPost with Id: ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

//---GET:id---

blogPostRouter.get("/:blogId/comments/:commentId", async(req, res, next)=>{
  try {
    const blogPost = await BlogPostModel.findById(req.params.blogId)
    if(blogPost){
      const comment = blogPost.comments.find(com => com._id.toString() === req.params.commentId)
      if(comment){
        res.send(comment)
      } else {
        next(createHttpError(404, `Comment with Id: ${req.params.commentId} not found!`))
      }
    } else {
      next(createHttpError(404, `BlogPost with Id: ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

//---Put---

blogPostRouter.put("/:blogId/comments/:commentId", async(req, res, next) =>{
  try {
    const blogPost = await BlogPostModel.findById(req.params.blogId)
    if(blogPost){
      const index = blogPost.comments.findIndex(com => com._id.toString() === req.params.commentId)
      if(index !== -1){
        blogPost.comments[index] = {...blogPost.comments[index], ...req.body}
        await blogPost.save()
        res.send(blogPost)
      } else {
        next(createHttpError(404, `Comment with Id: ${req.params.commentId} not found!`))
      }
    }else {
      next(createHttpError(404, `BlogPost with Id: ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

//---Delete---

blogPostRouter.delete("/:blogId/comments/:commentId", async(req, res, next) =>{
  try {
    const blogPost = await BlogPostModel.findByIdAndUpdate(req.params.blogId, {$pull: {comments: {_id: req.params.commentId}}}, {new: true})
    if(blogPost){
      res.send(blogPost)
    } else{
      next(createHttpError(404, `BlogPost with Id: ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})


export default blogPostRouter