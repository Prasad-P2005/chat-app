// signup new user

import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

const signupUser = async (req, res) => {
  const { fullName, email, password, bio } = req.body

  try {
    if (!fullName || !email || !password) {
      return res.json({ success: false, message: "All fields are required" })
    }
    const user = await User.findOne({ email })

    if (user) return res.json({ success: false, message: "Account already exists." })

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      fullName, email, password: hashedPassword, bio
    })

    // we are signing with id
    const token = generateToken(newUser._id)

    res.json({ success: true, userData: newUser, token, message: "User Created Successfully." })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const userData = await User.findOne({ email })
    if (!userData) return res.json({ success: false, message: "User not found." })

    const isPasswordMatched = await bcrypt.compare(password, userData.password)
    if (!isPasswordMatched) return res.json({ success: false, message: "Invalid credentials." })

    // we are signing with id
    const token = generateToken(userData._id)

    res.json({ success: true, userData: userData, token, message: "User Login Successfully." })


  } catch (error) {

    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

const checkAuth = async (req, res) => {
  res.json({ success: true, userData: req.user })
}

const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body

    const userId = req.user._id

    let updatedUser;

    if (!profilePic) updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true })
    else {
      const upload = await cloudinary.uploader.upload(profilePic)

      updatedUser = await User.findByIdAndUpdate(userId,
        { bio, fullName, profilePic: upload.secure_url },
        { new: true })

    }
    res.json({ success: true, user: updatedUser })
  } catch (err) {
    console.log(err.message)
    res.json({ success: false, message: err.message })
  }
}

export { signupUser, loginUser, checkAuth, updateProfile }