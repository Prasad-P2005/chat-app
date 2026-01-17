import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets.js'
import { AuthContext } from '../../context/AuthContext.jsx'

const Profile = () => {

  const { authUser, updateProfile } = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handelSubmit = async (e) => {

    e.preventDefault()

    if (!selectedImg) {
      await updateProfile({ fullName: name, bio: bio })
      navigate("/")
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg)
    reader.onload = async () => {
      const base64Image = reader.result
      await updateProfile({ profilePic: base64Image, fullName: name, bio })
      navigate("/")
    }
  }


  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>

      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2
      border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg
      '>

        {/* Left side - Profile form */}
        <form onSubmit={handelSubmit} className="flex flex-col gap-5 p-9 flex-1">

          <div className='flex items-center gap-3'>
            <img src={assets.arrow_icon} className='w-5 h-5 cursor-pointer' onClick={() => {navigate("/")}}/>
            {/* Profile details section */}
            <h3 className='text-lg'>Profile details</h3>
          </div>

          {/* Avatar upload */}
          <label htmlFor="avtar" className='flex items-center gap-3 cursor-pointer'>

            {/* Hidden file input */}
            <input onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file" id='avtar' accept='.png, .jpg, .jpeg' hidden />

            {/* Avatar display */}
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
              className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />

            Upload File Image

          </label>

          {/* Name input */}
          <input
            onChange={(e) => setName(e.target.value)} value={name}
            type="text" required placeholder='Your name' className='p-2 border
          border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
          />
          {/* Bio textarea */}
          <textarea
            onChange={(e) => setBio(e.target.value)} value={bio}
            required placeholder={`${bio}`} className='p-2 border
          border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
            rows={4}
          ></textarea>

          {/* Save button */}
          <button type='submit' className='bg-linear-to-r from-purple-500 to-violet-600
          text-white p-2 rounded-full cursor-pointer'>Save Changes</button>
        </form>

        {/* Right side - Profile preview */}
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`}
          src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default Profile