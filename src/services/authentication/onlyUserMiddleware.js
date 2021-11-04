import blogPostModel from "../blogPosts/schema.js";


export const onlyUserMiddleware = async (req, res, next) => {
  const blog = await blogPostModel.findById(req.params._id);
  if (blog.authors[0].toString() === req.author._id.toString()) {
    req.blog = blog;
    next();
  } else {
    res.status(403).send({ message: "Not authorised" });
    return;
  }
};