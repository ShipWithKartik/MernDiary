import React, { useState } from 'react'
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import DateSelector from './DateSelector';
import ImageSelector from './ImageSelector';

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories
}) => {

    const [visitedDate , setVisitedDate] = useState(null);
    const [title , setTitle] = useState('');
    const [storyImg , setStoryImg] = useState(null);
    const [story , setStory] = useState('');
    const [visitedLocation , setVisitedLocation] = useState([]);



    const handleOrUpdateClick = ()=>{

    }

  return (

    <div>
        <div className='flex items-center justify-between'>
            <h5 className='text-xl font-medium text-slate-700'
            >
                {type === 'add' ? 'Add Story' : 'Update Story'}
            </h5>

            <div>
                <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-lg">

                    {type === 'add' ? (
                        <button 
                        className="btn-small cursor-pointer"
                        onClick={handleOrUpdateClick}>
                            <IoMdAdd className='text-white text-xl'/> 
                            ADD STORY    
                        </button>
                    ):(
                        <>
                            <button 
                            className="btn-small"
                            onClick={handleOrUpdateClick} >
                                <MdOutlineUpdate 
                                className='text-lg'/>
                                UPDATE STORY
                            </button>

                            <button
                            className='btn-small btn-delete'>
                                <MdDeleteOutline className='text-lg'/>
                                DELETE STORY
                            </button>
                        </>
                    )}

                    <button
                    className=''
                    onClick={onClose}>
                        <IoMdClose className='text-xl text-slate-400 cursor-pointer'/>
                    </button>
                </div>
            </div>
        </div>



        <div className="flex flex-1 flex-col gap-2 p-4">
            <lable className="input-label">
                TITLE
            </lable>
            <input 
            type="text" 
            className='text-2xl text-slate-900 outline-none'
            placeholder='Once Upon A Time...'
            value={title}
            onChange={(event)=>{
                setTitle(event.target.value)
            }}/>

            <div className="my-3">
                <DateSelector 
                date={visitedDate}
                setDate={setVisitedDate} />
            </div>

            <ImageSelector 
            image={storyImg} 
            setImage={setStoryImg}/>

            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>
                    STORY
                </label>
                <textarea 
                type='text' 
                className='text-sm text-slate-950 
                outline-none bg-slate-100 p-2 rounded-sm'
                placeholder='Your Story...'
                rows={10}
                value={story}
                onChange={(event)=>{
                    setStory(event.target.value)
                }} >
                </textarea>
            </div>
        </div>
    </div>

  )
}

export default AddEditTravelStory