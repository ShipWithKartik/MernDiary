import moment from 'moment'
import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";

const TravelStoryCard = ({
    imageUrl,
    title,
    story,
    isFavorite , 
    date , 
    visitedLocation,
    onEdit , 
    onClick , 
    onFavoriteClick }) =>{

  return (

    <div className='border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer mb-4 w-full max-w-[400px]'>

        {/* Compact image container */}
        <div className='w-full h-65 bg-slate-100'>
            <img 
            src={imageUrl} 
            alt={title} 
            className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
            onClick={onClick}/>
        </div>

        <button 
        className='w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4'
        onClick={onFavoriteClick}>

            <FaHeart className={`icon-btn ${isFavorite ? 'text-red-500' : 'text-white'} hover:text-red-500`}/>
        </button>


        <div 
        className='p-3' 
        onClick={onClick} >
            <h6 
            className='text-sm font-semibold text-slate-800 mb-1 line-clamp-1'>
                {title}
            </h6>

            <span 
            className='text-xs text-slate-500 block mb-2'>
                {date ? moment(date).format('Do MMM YYYY') : "-"}
            </span>

            <p className='text-xs text-slate-600 line-clamp-2'>
                {story?.slice(0,40)}...
            </p>

            <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600  bg-cyan-200/40 rounded mt-3 px-2 py-1'>
                <FaLocationDot className='text-sm'/>
                {visitedLocation.map((item,index)=> visitedLocation.length === index + 1 ? `${item}` : `,${item}`)}
            </div>
        </div>
    </div>

  )

}

export default TravelStoryCard