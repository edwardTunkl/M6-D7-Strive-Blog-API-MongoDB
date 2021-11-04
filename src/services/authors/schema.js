import mongoose from "mongoose";
import bcrypt from "bcrypt"
const { Schema, model } = mongoose;

const AuthorModel = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {type:String, required: true},
    password: {type: String, required: function () { return !Boolean(this.googleId) }},
    refreshToken: { type: String },
    googleId: { type: String, required: function () { return !Boolean(this.password) } }
  },
  { timestamp: true }
);

AuthorModel.pre("save", async function (next) {

  const newAuthor = this
  const plainPassword = newAuthor.password

  if(newAuthor.isModified("password")){
    newAuthor.password = await bcrypt.hash(plainPassword, 10)
  }
  next()
})

//---avoid sending critial data in json response---

AuthorModel.methods.toJSON = function (){
  const userDocument = this
  const userObject = userDocument.toObject()
  delete userObject.password

  return userObject
}

AuthorModel.statics.checkCredentials = async function (email, plainPassword) {
const user = await this.findOne({email})

if (user){

const isPasswordMatching = await bcrypt.compare(plainPassword, user.password)
if(isPasswordMatching) return user

else return null
} else return null
}



export default model("Author", AuthorModel);
