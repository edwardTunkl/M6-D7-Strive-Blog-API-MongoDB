import mongoose from "mongoose";
import bcrypt from "bcrypt"
const { Schema, model } = mongoose;

const AuthorSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {type:String, required: true},
    password: {type: String, required: true}
  },
  { timestamp: true }
);

AuthorSchema.pre("save", async function (next) {

  const newAuthor = this
  const plainPassword = newAuthor.password

  if(newAuthor.isModified("password")){
    newAuthor.password = await bcrypt.hash(plainPassword, 10)
  }
  next()
})

//---aviod sending critial data in json response---

AuthorSchema.methods.toJSON = function (){
  const userDocument = this
  const userObject = userDocument.toObject()
  delete userObject.password

  return userObject
}

AuthorSchema.statics.checkCredentials = async function (email, plainPassword) {
const user = await this.findOne({email})

if (user){

const isPasswordMatching = await bcrypt.compare(plainPassword, user.password)
if(isPasswordMatching) return user

else return null
} else return null
}



export default model("Author", AuthorSchema);
