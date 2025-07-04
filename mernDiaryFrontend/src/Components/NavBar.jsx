import React from 'react'
import { Link } from 'react-router-dom'
import Profile from './Profile'

const NavBar = () => {

  return (

    <div className="bg-white flex items-center justify-between px-10 py-2 drop-shadow-sticky top-0">
        <Link to={'/'}>
            <h1 className='font-bold text-2xl sm:text-2xl flex flex-wrap'>
                <span className='text-blue-400'>
                    Travel
                </span>
                <span className='text-blue-800'>
                    Diary
                </span>
            </h1>
        </Link>

        <Profile />
    </div>

  )
}

export default NavBar