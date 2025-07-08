import React, { useEffect, useRef, useState } from 'react'
import { BsUpload } from 'react-icons/bs';
import { MdDelete, MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({image , setImage , handleDeleteImage}) => {

    const inputRef = useRef(null);
    const [previewUrl , setPreviewUrl] = useState(null);

    const hanldeImageChange = (event)=>{
        const file = event.target.files[0];

        if(file){
            setImage(file);
        }
    }

    const onChooseFile = ()=>{
        inputRef.current.click();
    }

    const handleRemoveImage = ()=>{
        setImage(null);
        handleDeleteImage();
    }

    useEffect(()=>{
        if(typeof image === 'string')
            setPreviewUrl(image);
        else if(image)
            setPreviewUrl(URL.createObjectURL(image));
        else
            setPreviewUrl(null);

        return ()=>{
            if(previewUrl && typeof previewUrl === 'string' && !image)
                URL.revokeObjectURL(previewUrl);
        }
    },[image])

  return (

    <div>
        <input 
        type='file' 
        accept='image/*'
        ref={inputRef} 
        onChange={hanldeImageChange}
        className='hidden'/>

        {!image ? (<button 
        className='w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-sm border border-slate-200/50 cursor-pointer'
        onClick={()=>{onChooseFile()}}>

            <div className='w-14 h-14 flex items-center justify-center bg-cyan-100 rounded-full border border-cyan-100'>
                <BsUpload className='text-3xl font font-bold text-cyan-500'/>
            </div>

            <p 
            className='text-sm text-slate-500'>
                Browse Image Files to Upload
            </p>
        </button>) : (
            <div className="w-full relative">
                <img 
                src={previewUrl} 
                alt='Selected' 
                className='w-full h-[300px] object-cover rounded-lg' />

                <button 
                className="btn-small btn-delete absolute top-2 right-2"
                onClick={handleRemoveImage} >
                    <MdDeleteOutline  className='text-xl'/>
                </button>
            </div>
        )}

    </div>

  )
}

export default ImageSelector