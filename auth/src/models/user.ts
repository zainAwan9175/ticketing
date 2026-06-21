import mongoose from "mongoose";

import { Password } from "../services/password.js";
interface UserAttrs {
  email: string;
  password: string;
}


interface userDoc extends mongoose.Document {
  email: string;
  password: string;
}


interface UserModel extends mongoose.Model<userDoc> {
    build(attrs: UserAttrs): userDoc;
}




const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {   
    type: String,
    required: true,
  },

}
,{
  toJSON: {
    transform(_doc: mongoose.Document, ret: { _id?: mongoose.Types.ObjectId; __v?: number; password?: string; id?: string }) {
      if (ret._id) {
        ret.id = ret._id.toString();
      }
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    } 
  }
}); 

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(
      this.get('password')
    );

    this.set('password', hashed);
  }
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}       

const User = mongoose.model<userDoc,UserModel>('User', userSchema);

// const createUser = async (attrs: UserAttrs) => {
//   const user = new User(attrs);
//   await user.save();
//   return user;
// }

// User.build({ email: 'zain@gmail.com', password: 'password' });



export { User }