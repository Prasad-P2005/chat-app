import React, { useContext, useState } from 'react'
import { createContext } from 'react'
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUsers] = useState(null)
  const [unseenMessages, setUnseenMessages] = useState({})

  const { socket, axios } = useContext(AuthContext)

  // function to get all users from sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users")
      if (data.success) {
        setUsers(data.users)
        setUnseenMessages(data.unseenMessages)
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
  const sendMessage = async () => {
    try{
      const {data} = await axios.post(`/api/message/send/${selectedUser._id}`, messageData)
      if(data.success){
        setMessages((prevMessages) => [...prevMessages, data.newMessage])
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  const value = {

  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
