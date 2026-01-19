import express from "express"
import { checkAuth, loginUser, signupUser, updateProfile } from "../controllers/user.controller.js"
import protectRoute from "../middlewares/protectRoute.middleware.js"

const userRouter = express.Router()

userRouter.post("/signup", signupUser)

userRouter.post("/login", loginUser)
userRouter.put("/update", protectRoute, updateProfile)

userRouter.get("/check", protectRoute, checkAuth)

export default userRouter