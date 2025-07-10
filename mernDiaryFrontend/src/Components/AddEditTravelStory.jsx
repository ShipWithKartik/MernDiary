import React, { useState } from 'react';
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import DateSelector from './DateSelector';
import ImageSelector from './ImageSelector';
import TagInput from './TagInput';
import axiosInstance from '../utils/axiosInstance';
import moment from 'moment';
import { ToastContainer,toast } from 'react-toastify';
import uploadImage from '../utils/uploadImage';

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories
}) => {

    const [visitedDate , setVisitedDate] = 
    useState(storyInfo?.visitedDate || null);

    const [title , setTitle] = 
    useState(storyInfo?.title || '');

    const [storyImage , setStoryImage] = 
    useState(storyInfo?.imageUrl || null);

    const [story , setStory] = 
    useState(storyInfo?.story || '');

    const [visitedLocation , setVisitedLocation] = 
    useState(storyInfo?.visitedLocation || []);

    const [error , setError] = useState('');


    const addNewTravelStory = async()=>{

        try{
            let imageUrl = '';

            if(storyImage){
                const imageUploadRes = await uploadImage(storyImage);

                imageUrl = imageUploadRes.imageUrl || '';
            }
            const response = await axiosInstance.post('/story/add',{
                title,
                story,
                imageUrl:imageUrl||'',
                visitedDate:visitedDate 
                ? moment(visitedDate).valueOf() 
                : moment().valueOf(),
                visitedLocation
            })

            if(response.data.story){
                toast.success('Story Created Successfully');


                getAllTravelStories();
                // Created a new story and saved that story in the database , now our database contains the updated stories (new story added) , now we want to render this newly created story in my home page as well .Thus we are calling getAllTravelStories() function which fetches all stories for the current loggedIn user (backend verfies token and extracts userId) , this function then calls setAllStories useState hook function , which triggers a re-render

                onClose();
                // Close the add/Edit story modal when clicked on add Story and story was added successfully 
            }
        }catch(error){
            console.log(error);
        }

    }

    const updateTravelStory = async()=>{
        const storyId = storyInfo._id;

        try{
            let imageUrl = storyInfo.imageUrl || '';

            if( storyImage && typeof storyImage === 'object'){
                // Upload new Image
                const imageUploadRes = await uploadImage(storyImage);
                
                imageUrl = imageUploadRes.imageUrl;
            }
            const postData = {
                title,
                story,
                imageUrl,
                visitedDate: visitedDate
                ? moment(visitedDate).valueOf()
                : moment().valueOf(),
                visitedLocation,
            };

            const response = await axiosInstance.post(`/story/edit-story/${storyId}`,postData);

            if(response?.data?.editStory)
                toast.success('Story Updated Successfully');

            getAllTravelStories();
            onClose();
        }catch(error){
            if(error?.response?.data?.message)
                setError(error?.response?.data?.message);
            else
                setError('Something went wrong');
        }
    }

    const handleOrUpdateClick = ()=>{
        if(!title){
            setError('Please Enter the Title');
            return;
        }
        else if(!story){
            setError('Please Enter the Story');
            return;
        }

        setError('');

        if(type == 'edit'){
            updateTravelStory();
        }
        else {
            addNewTravelStory(); 
        }

    }

    const handleDeleteStoryImage = async ()=>{
        const deleteImageResponse = await axiosInstance.delete('/story/delete-image',
            {
                params:{
                    imageUrl:storyInfo.imageUrl
                }
            }
        )

        if(deleteImageResponse?.data?.message){
            const storyId = storyInfo._id;

            const postData = {
                title,
                story,
                visitedDate: moment(storyInfo.visitedDate).valueOf(),
                visitedLocation,
                imageUrl:''
            }

            const response = await axiosInstance.post('/story/edit-story/'+storyId,postData);


            if(response.data){
                toast.success('Image Deleted!');
            }
        }
    }

  return (

    <div className='relative'>
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


                {error && (
                    <p 
                    className='text-red-500 text-xs pt-2 text-right'>
                        {error}
                    </p>
                )}
            </div>
        </div>



        <div className="flex flex-1 flex-col gap-2 p-4">
            <label className="input-label">
                TITLE
            </label>
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
            image={storyImage} 
            setImage={setStoryImage}
            handleDeleteImage={handleDeleteStoryImage} />

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

            <div className="pt-3">
                <label 
                className='input-label'>
                    VISITED LOCATIONS
                </label>

                <TagInput 
                tags={visitedLocation} 
                setTags={setVisitedLocation} />
            </div>

        </div>
    </div>

  )
}

export default AddEditTravelStory