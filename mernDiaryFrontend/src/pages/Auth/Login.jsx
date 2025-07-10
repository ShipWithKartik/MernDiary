import { use, useEffect, useState } from "react"
import PasswordInput from "../../Components/PasswordInput"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { validateEmail } from "../../utils/helper"
import {useDispatch, useSelector} from "react-redux"
import { signInStart , signInSuccess,signInFailure } from "../../redux/slice/userSlice"



const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {loading , currentUser} = useSelector((state)=>state.user);
  // useSelector takes a function that receives the entire state and returns the part of the state you want to use in your component. In this case, we are getting the loading state from the user slice.(state.user accesses the user slice of the Redux state)
  // It helps us subscribe to the Redux state and re-render the component only when that specific part changes 

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateEmail(email)) {
      setError("Please Enter a valid Email")
      return
    }

    if (!password) {
      setError("Please Enter a Password")
      return
    }

    setError(null)

    try {

      dispatch(signInStart());
      const response = await axiosInstance.post("/auth/signin/", {
        email,
        password,
      })

      if (response.data) {
        dispatch(signInSuccess(response.data));
        navigate("/")
      }
    } 
    catch (error) {
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message)
        
        dispatch(signInFailure(error?.response?.data?.message));
      } 
      else {
        dispatch(signInFailure("Something went wrong, please try again later"));

        setError("Something went wrong, please try again later")
      }
    }
  }

  useEffect(()=>{
    if(!loading && currentUser){
      navigate('/');
    }
  },[currentUser]);
  // if a user is already logged in and tries to access /login page , the useEffect will redirect to home page 
  // When Login.jsx mounts the useEffect runs and it checks if loading is false and currentUser is not null so it triggers navigate('/').

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10" />

      <div className="container min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-20 mx-auto relative z-10">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Panel - Hero Section */}
          <div
            className="w-full lg:w-1/2 h-64 lg:h-auto flex items-end bg-cover bg-center relative"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/586687/pexels-photo-586687.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative z-10 p-8 lg:p-12">
              <h4 className="text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight mb-4">
                Create Your <br />
                Stories
              </h4>
              <p className="text-base lg:text-lg text-white/90 leading-relaxed max-w-md">
                Record your travel experiences and memories in your travel journey
              </p>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">

            <form 
            onSubmit={handleSubmit} 
            className="w-full max-w-md mx-auto">
                
              <div className="mb-8">
                <h4 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h4>
                <p className="text-gray-600">Sign in to continue your journey</p>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                    }}
                  />
                </div>

                <PasswordInput
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                {loading ? (
                  <button
                    disabled
                    className="w-full bg-gradient-to-r from-cyan-500/70 to-blue-500/70 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 cursor-not-allowed"
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-cyan-200 shadow-lg"
                  >
                    SIGN IN
                  </button>
                )}

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 border-2 border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-gray-200"
                  onClick={() => {
                    navigate("/signup")
                  }}
                >
                  CREATE NEW ACCOUNT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
