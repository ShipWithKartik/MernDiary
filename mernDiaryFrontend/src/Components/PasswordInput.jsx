import { useState } from "react"
import { FaRegEye } from "react-icons/fa"
import { FaRegEyeSlash } from "react-icons/fa6"

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword)
  }

  return (
    <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg mb-4 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-transparent transition-all duration-200">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Enter Your Password"}
        type={isShowPassword ? "text" : "password"}
        className="w-full px-4 py-3 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
      />
      <button
        type="button"
        className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
        onClick={toggleShowPassword}
      >
        {isShowPassword ? (
          <FaRegEye size={20} className="text-gray-500 hover:text-gray-700" />
        ) : (
          <FaRegEyeSlash size={20} className="text-gray-500 hover:text-gray-700" />
        )}
      </button>
    </div>
  )
}

export default PasswordInput
