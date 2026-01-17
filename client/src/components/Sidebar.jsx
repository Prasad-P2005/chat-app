import React from 'react'
import assets, { userDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const {logout}= useContext(AuthContext)
  const navigate = useNavigate()
  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white
      ${selectedUser ? 'max-md:hidden' : ''}
    `}>
      {/* Header section */}
      <div className='pb-5'>

        {/* Navbar of the sidebar */}
        <div className="flex justify-between items-center">
          {/* logo of navbar of sidebar */}
          <img src={assets.logo} alt="logo" className="max-w-40" />

          {/* group is named to a div under which all the children gets the property */}
          <div className="relative py-2 group">

            {/* Menu icon */}
            <img src={assets.menu_icon} alt="Menu" className="max-h-5 cursor-pointer" />

            {/* Uses group-hover to show the menu */}
            {/* <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border 
            border-gray-500 text-gray-100 hidden group-hover:block '>
              <p onClick={() => navigate("/profile")} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className="my-2 border-t border-gray-500" />
              <p className='cursor-pointer text-sm' >Logout</p>
            </div> */}
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142]
  border border-gray-500 text-gray-100
  opacity-0 transition-opacity duration-1000
  group-hover:opacity-100 group-hover:duration-0'>
              <p onClick={() => navigate("/profile")} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={logout} className='cursor-pointer text-sm'>Logout</p>
            </div>



          </div>

        </div>

        {/* Search bar */}
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input type="text" placeholder='Search User...' className='bg-transparent border-none outline-none text-white placeholder-[#c8c8c8] flex-1' />
        </div>

      </div>

      {/* User list section */}
      <div className='flex flex-col '>
        {userDummyData.map((user, index) => (
          // single return of each user

          <div onClick={() => { setSelectedUser(user) }} key={index} className={`relative flex 
          items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm 
          // Selected user background gets a color
          ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>

            {/* User avatar */}
            <img src={user.profilePic || assets.avatar_icon} alt="" className='w-8.75
            aspect-ratio-[1/1] rounded-full' />

            {/* User info */}
            <div>
              <p>{user.fullName}</p>
              {/* Online/Offline status */}
              {
                index < 3
                  ? <span className='text-green-400 text-xs'>Online</span>
                  : <span className='text-gray-400 text-xs'>Offline</span>
              }
            </div>

            {/* Unread message count */}
            {index > 2 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full 
              bg-violet-500/50'>{index}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar