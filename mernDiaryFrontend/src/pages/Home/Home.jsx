import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../Components/NavBar';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../Components/TravelStoryCard';


const Home = () => {

  const [allStories , setAllStories] = useState([]);

  const getAllTravelStories = async()=>{

    try{
      const response = await axiosInstance.get('/story/get-all');

      console.log(response.data.stories);

      if(response.data && response.data.stories){
        setAllStories(response.data.stories);
      }

    }
    catch(error){
      console.error("Error fetching travel stories:", error);
    }
  }


  const handleEdit = async (item) => {}

  const handleViewStory = (item) => {}

  const updateIsFavorite = async(item) => {}


  useEffect(()=>{
    getAllTravelStories();

  },[])
  

  return (

    <div>
      <NavBar />

      <div className='container mx-auto py-10'>
        <div className='flex gap-7'>

          <div className='flex-1'>
            {allStories.length>0 ? (

              <div>
                {allStories.map((item) =>{
                  return (
                    <TravelStoryCard 
                    key={item._id}
                    imageUrl={item.imageUrl} 
                    title={item.title} 
                    story={item.story} 
                    date={item.visitedDate} 
                    isFavorite={item.isFavorite} 
                    visitedLocation={item.visitedLocation}

                    onEdit={() => handleEdit(item)} 
                    onClick={()=> handleViewStory(item)} 
                    onFavoriteClick={()=>updateIsFavorite(item)}  
                     />
                  )
                })}
              </div>
            ) : (
              <div>Empty Card Here</div>
            )}

          </div>


          <div className='w-[320px]'>

          </div>

        </div>
      </div>

    </div>

  )                                                     
}

export default Home;
