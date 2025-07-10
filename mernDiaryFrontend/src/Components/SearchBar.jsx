import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

const SearchBar = ({value,onChange,Search,Clear}) => {

  return (

    <div className='w-80 flex items-center bg-slate-100 rounded-md'>
        <input 
        type="text"  
        placeholder='Search Notes...' 
        className='w-full text-sm bg-transparent py-[11px] px-2 outline-none' 
        onChange={onChange}  
        value={value}   
        />

        {value && (
            <IoMdClose className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3 text-[24px]' 
            onClick={Clear}/>
        )}
        <FaSearch  
        className='text-slate-400 cursor-pointer hover:text-black m-2 text-[24px]'
        onClick={Search} />
    </div>

  )
}

export default SearchBar