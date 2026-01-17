import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io, userSocketMap } from "../server.js";

// get all users for sidebar with their respective unread msg
const getSidebarUsers = async (req, res) => {
  try {
    const userId = req.user._id

    const filteredUser = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMsg = []
    const promises = filteredUser.map(async (user) => {
      const messages = await Message.find({ senderId: user._id, receiverId: userId },
        { seen: false })
      if (messages.length > 0) unseenMsg[user._id] = messages.length
    })

    // waits unit all the promises gets executed 
    await Promise.all(promises)

    res.json({success : true, users : filteredUser, unseenMsg})
  } catch (err) {
    console.log(err.message)
    res.json({ success: false, message: err.message })
  }
}

// the messages between two users and mark them as read
const getAllMessage = async (req, res) => {
  try {
    const { id: selectedUser } = req.params
    const myId = req.user._id

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUser },
        { senderId: selectedUser, receiverId: myId }
      ]
    })

    await Message.updateMany({ senderId: selectedUser, receiverId: myId }, { seen: true })

    res.json({ success: true, messages })
  } catch (err) {
    console.log(err.message)
    res.json({ success: false, message: err.message })
  }
}

// mark as read api
const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params
    await Message.findByIdAndUpdate(id, { seen: true })
    res.json({ success: true })
  } catch (err) {
    console.log(err.message)
    res.json({ success: false, message: err.message })
  }
}

// send message to user
const sendMessgae = async (req, res) => {
  try {
    const { id: receiverId } = req.params
    const { text, image } = req.body

    const senderId = req.user._id

    let imageUrl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url
    }
    const newMessage = await Message.create({ senderId: senderId, receiverId: receiverId, text: text, image : imageUrl })

    // Emit new message to receiver
    const receiverSocketId = userSocketMap[receiverId]
    if(receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage)

    res.json({success : true, message : newMessage})

  } catch (err) {
    console.log(err.message)
    res.json({ success: false, message: err.message })
  }
}

export { getSidebarUsers, getAllMessage, markMessageAsSeen, sendMessgae }