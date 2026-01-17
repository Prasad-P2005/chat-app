import React, { useState } from 'react'
import assets from '../assets/assets'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {

  const [currState, setCurrState] = useState("Sign Up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (e) => {
    e.preventDefault()

    if (currState == "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }

    login(currState == "Sign Up" ? 'signup' : 'login', {fullName, email, password, bio})
  }


  return (
    <div className='min-h-screen bg-cover bg-center flex items-center
  justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* left logo */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw, 250px)]' />

      {/* form container */}
      <form className='border-2 bg-white/8 text-white border-gray-500 p-6 
    flex flex-col gap-6 rounded-lg shadow-lg'
        onSubmit={onSubmitHandler}
      >

        {/* form title & Back Button */}
        <h2 className='flex items-center font-medium text-2xl justify-between'>{currState}
          {isDataSubmitted &&
            <img src={assets.arrow_icon} className='w-5 cursor-pointer'
              onClick={() => setIsDataSubmitted(false)}
            />
          }
        </h2>

        {/* if sign up and data not submitted input for name */}
        {currState === "Sign Up" && !isDataSubmitted && (
          <input type='text' onChange={(e) => setFullName(e.target.value)} value={fullName} className='p-2 border border-gray-500 rounded-md
          focus:outline-none' placeholder='Full Name' required />
        )}


        {/* if signup or login for both data not submitted input for email and password */}
        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setEmail(e.target.value)}
              value={email} type='email'
              className='p-2 border border-gray-500 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Email Address' required />

            <input onChange={(e) => setPassword(e.target.value)}
              value={password} type='password'
              className='p-2 border border-gray-500 rounded-md
              focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Password' required />
          </>
        )}

        {/* if signup and data submitted input for bio */}
        {currState === "Sign Up" && isDataSubmitted && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio}
            rows={4} className='p-2 border border-gray-500 rounded-md
          focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='provide a short bio' required
          ></textarea>
        )}

        {/* submit button */}
        <button type='submit' className='py-3 bg-linear-to-r 
        from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
        >
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {/* terms and conditions */}
        {!isDataSubmitted && currState == "Sign Up" && (
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <input type="checkbox" required />
            <p>Agree to the terms of use and privacy policy</p>
          </div>
        )}

        {/* login or signup toggle */}
        {!isDataSubmitted && (
          <div className='flex flex-col gap-2'>
            {currState === "Sign Up" ? (
              <p className='text-sm text-gray-600 flex gap-1 items-baseline'>
                Already have an account ?
                <span className='text-violet-500 font-medium cursor-pointer'
                  onClick={() => {
                    setCurrState("Login");
                    setIsDataSubmitted(false)
                  }}>
                  Login here
                </span>
              </p>
            ) : (
              <p className='text-sm text-gray-600'>
                Don't have an account?

                <span className='text-violet-500 font-medium cursor-pointer'
                  onClick={() => {
                    setCurrState("Sign Up");
                    setIsDataSubmitted(false);
                  }}>
                  Sign up here
                </span>
              </p>
            )}
          </div>
        )}
      </form>

    </div>
  )
}

export default Login
