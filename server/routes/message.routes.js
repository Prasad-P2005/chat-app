import express from "express"
import protectRoute from "../middlewares/protectRoute.middleware.js"
import { getAllMessage, getSidebarUsers, markMessageAsSeen, sendMessgae } from "../controllers/message.controller.js"

const messgaeRouter = express.Router()

messgaeRouter.get("/users", protectRoute, getSidebarUsers)
messgaeRouter.get("/:id", protectRoute, getAllMessage)
messgaeRouter.put("/mark/:id", protectRoute, markMessageAsSeen)
messgaeRouter.post("/send/:id", protectRoute, sendMessgae)

export default messgaeRouter