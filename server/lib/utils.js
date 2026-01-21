import jwt from "jsonwebtoken"

export const generateToken = (userId) => {
  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60),
    data: userId,
  }, process.env.JWT_SECRET)
  return token
}