import { useState } from "react"
import PasswordInput from "../../Components/PasswordInput"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { validateEmail } from "../../utils/helper"

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

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
      const response = await axiosInstance.post("/auth/signin/", {
        email,
        password,
      })

      if (response.data) {
        navigate("/home")
      }
    } 
    catch (error) {
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message)
      } 
      else {
        setError("Something went wrong, please try again later")
      }
    }
  }

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

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-cyan-200 shadow-lg"
                >
                  SIGN IN
                </button>

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
                    navigate("/sign-up")
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

export default Login
