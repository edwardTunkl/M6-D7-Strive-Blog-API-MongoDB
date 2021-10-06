export const notFound = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send({ message: err.message || "Not found!" })
  } else {
    next(err)
  }
}

export const badRequest = (err, req, res, next) => {
  if (err.status === 400 || err.name === "ValidationError") {
    res.status(400).send({ message: err.errors || "Bad Request!" })
  } else {
    next(err)
  }
}

export const genericError = (err, req, res, next) => {
  console.log(err)
  res.status(500).send({ message: "Generic Server Error!" })
}