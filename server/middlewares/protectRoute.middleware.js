import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token

    if (!token) return res.json({ success: false, message: "Unauthorized" })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.data.userId).select("-password")

    if (!user) return res.json({ success: false, message: "User not found" })

    req.user = user
    next()
  }
  catch (err) {
    console.log(err.message)
    res.json({ success: false, message: err.message })
  }
}

export default protectRoute