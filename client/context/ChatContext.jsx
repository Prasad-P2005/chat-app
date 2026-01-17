import React, { useContext, useState } from 'react'
import { createContext } from 'react'
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [unseenMessages, setUnseenMessages] = useState({})

  const { socket, axios } = useContext(AuthContext)

  // function to get all users from sidebar
  // all users gets all the users and unseenMessages of everyone gets here
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users")
      if (data.success) {
        setUsers(data.users)
        setUnseenMessages(data.unseenMsg)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // function to get messages for selected users
  
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`)
      if (data.success) setMessages(data.messages)
    } catch (error) {
    }
  }

  // function to send Messages to selected User
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.message])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // function to subscribe to message for selected user => just to mark as read
  const subscribeToMessages = async (req, res) => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if(selectedUser && newMessage.senderId === selectedUser._id){
        newMessage.seen = true
        setMessages((prevMessages) => [...prevMessages, newMessage])
        axios.put(`/api/messages/mark/${newMessage._id}`)
      }else{
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
        }))
      }
    })
  }

  // function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if(socket) socket.off("newMessage");
  }

  useEffect(() => {
    console.log("Chat Context is Loaded")
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser])

  const value = {
    messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
