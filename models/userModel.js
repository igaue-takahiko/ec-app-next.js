import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true
  },
  role: {
      type: String,
      default: 'user'
  },
  root: {
      type: Boolean,
      default: false
  },
  avatar: {
      type: String,
      default: 'https://res.cloudinary.com/dhst2rbxf/image/upload/v1610678220/no-profile_xeeejw.png'
  }
}, {
    timestamps: true
})

let Dataset = mongoose.models.user || mongoose.model('user', userSchema)

export default Dataset
