import React, { useRef } from 'react'
import { BsUpload } from 'react-icons/bs';

const ImageSelector = ({image , setImage}) => {

    const inputRef = useRef(null);

    const hanldeImageChange = ()=>{

    }

    const onChooseFile = ()=>{
        inputRef.current.click();
    }

  return (

    <div>
        <input 
        type='file' 
        accept='image/*'
        ref={inputRef} 
        onChange={hanldeImageChange}
        className='hidden'/>

        <button 
        className='w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-sm border border-slate-200/50 cursor-pointer'
        onClick={()=>{onChooseFile()}}>

            <div className='w-14 h-14 flex items-center justify-center bg-cyan-100 rounded-full border border-cyan-100'>
                <BsUpload className='text-3xl font font-bold text-cyan-500'/>
            </div>

            <p 
            className='text-sm text-slate-500'>
                Browse Image Files to Upload
            </p>
        </button>

    </div>

  )
}

export default ImageSelector