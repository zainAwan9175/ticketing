import mongoose from "mongoose";
import { Password } from "../services/password.js";
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform(_doc, ret) {
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
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
});
userSchema.statics.build = (attrs) => {
    return new User(attrs);
};
const User = mongoose.model('User', userSchema);
// const createUser = async (attrs: UserAttrs) => {
//   const user = new User(attrs);
//   await user.save();
//   return user;
// }
// User.build({ email: 'zain@gmail.com', password: 'password' });
export { User };
