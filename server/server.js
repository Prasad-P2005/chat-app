import express from "express"
import "dotenv/config"
import http from "http";
import cors from "cors"
import { connectToDB } from "./lib/db.js";
import userRouter from "./routes/user.routes.js";
import messgaeRouter from "./routes/message.routes.js";
import { Server } from "socket.io"

// app and server
const app = express()
const server = http.createServer(app)

// socket
export const io = new Server(server, {
  cors : {origin : "*"}
})

// store online users
export const userSocketMap = {}

// socket.io connection (this will kind of happen when a frontend is created and then it connectso)

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  console.log("User Connected", userId)

  if(userId) userSocketMap[userId] = socket.id

  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId)
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})

app.use(express.json({ limit: "4mb" }))
app.use(cors())

app.use("/api/status", (req, res) => {
  res.send("Server is Live.")
})

app.use("/api/auth", userRouter)
app.use("/api/messages", messgaeRouter)

await connectToDB();

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))