import { useEffect, useState } from "react"
import NavBar from "../../Components/NavBar"
import axiosInstance from "../../utils/axiosInstance"
import TravelStoryCard from "../../Components/TravelStoryCard"
import { ToastContainer, toast } from "react-toastify"
import { IoMdAdd } from "react-icons/io"
import Modal from "react-modal"
import AddEditTravelStory from "../../Components/AddEditTravelStory"
import ViewTravelStory from './ViewTravelStory'
import EmptyCard from "../../Components/EmptyCard"
import { DayPicker } from "react-day-picker"
import moment from "moment"
import FilterInfo from '../../Components/FilterInfo'

const Home = () => {
  const [allStories, setAllStories] = useState([]);

  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModel , setOpenViewModel] = useState({
    isShown:false,
    type:'view',
    data:null,
  })

  const [searchQuery , setSearchQuery] = useState('');

  const [filterType , setFilterType] = useState('');

  const [dateRange , setDateRange] = useState({
    from:null , 
    to:null
  });


  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/story/get-all")
      console.log(response.data.stories)
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.error("Error fetching travel stories:", error)
    }
  }

  const handleEdit = async (item) => {
    setOpenAddEditModel({isShown:true,type:'edit',data:item})
  }

  const handleViewStory = (storyId) => {
    
    const currentStory = allStories.find((story)=>story._id == storyId)

    if(!currentStory)
      return ;

    setOpenViewModel({
      isShown:true,
      type:'view',
      data:currentStory
    })
  }


  // Updated function to take storyId instead of full object
  const updateIsFavorite = async (storyId) => {
    // Get the current story from state to ensure we have the latest data
    const currentStory = allStories.find((story) => story._id === storyId)
    if (!currentStory) return

    const newFavoriteStatus = !currentStory.isFavorite

    try {
      const response = await axiosInstance.put("/story/update-is-favourite/" + storyId, {
        isFavorite: newFavoriteStatus,
      })

      console.log("API response:", response.data)

      // Update state regardless of what the API returns (optimistic update)
      setAllStories((prevStories) =>
        prevStories.map((story) => (story._id === storyId ? { ...story, isFavorite: newFavoriteStatus } : story)),
      )

      if (response?.data?.updatedStory) toast.success("Story Updated Successfully!")
    } catch (error) {
      console.error("Error updating favorite status:", error)

      // Revert the changes if API call fails
      setAllStories((prevStories) =>
        prevStories.map((story) => (story._id === storyId ? { ...story, isFavorite: !newFavoriteStatus } : story)),
      )
      toast.error("There was Some Error")
      console.log("Something went wrong. Please try again!")
    }
  }


  const deleteTravelStory = async (storyData) => {
    const storyId = storyData._id;
  
    // Add confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this story?');
  
    if (!confirmDelete) {
      return; // Exit if user cancels
    }
  
    try {
      const response = await axiosInstance.delete(`/story/delete-story/${storyId}`);

      if (response?.data?.message) {
        // Update the state immediately by filtering out the deleted story
        setAllStories((prevStories) => 
          prevStories.filter(story => story._id !== storyId)
        );

        // Close the modal
        setOpenViewModel((prevState) => ({
          ...prevState,
          isShown: false
        }));

        // Show success toast
        toast.success('Story Deleted Successfully');
      }
    }catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story. Please try again.');
    }
  };


  const onSearchStory = async(query)=>{
    try{
      const response = await axiosInstance.get('/story/search',{
        params:{
          query:query
        }
      })

      if(response?.data?.searchResults){
        setFilterType('search');
        setAllStories(response.data.searchResults);
      }
    }catch(error){
      console.log();
    }
  }

  const handleClearSearch = ()=>{
    setFilterType('');
    getAllTravelStories();
  }

  const filterStoryByDate = async(day)=>{
    try{
      const startDate = day.from ? 
      moment(day.from).valueOf() 
      : null
      const endDate = day.to ? 
      moment(day.to).valueOf()
      : null

      if(startDate && endDate){
        const response = await axiosInstance.get('/story/filter',{
          params: {startDate , endDate}
        })

        if(response?.data?.filteredStories){
          setFilterType('date');
          setAllStories(response.data.filteredStories);
        }
      }
    }catch(error){
      console.log();
    }
  }

  const handleDayClick = (day)=>{
    setDateRange(day);
    filterStoryByDate(day);
  }


  const resetFilter = ()=>{
    setDateRange({from:null , to:null})
    setFilterType('');
    getAllTravelStories();
  } 

  useEffect(() => {
    getAllTravelStories()
  }, [])

  return (
    <div>
      <NavBar 
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}   
      onSearchStory={onSearchStory} 
      handleClearSearch={handleClearSearch} />


      <div className="container mx-auto py-10">

        <FilterInfo  
        filterType={filterType} 
        filterDate={dateRange}  
        onClear={()=>{
          resetFilter();
        }} />

        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
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
                      onClick={() => handleViewStory(item._id)}
                      onFavoriteClick={() => updateIsFavorite(item._id)}
                    />
                  )
                })}
              </div>
            ) : (
              <div>
                <EmptyCard 
                imgSrc={"https://images.pexels.com/photos/7958169/pexels-photo-7958169.jpeg"} 
                message={`No Notes Here! 
                  Start Creating Your Travel Stories Click the 'Add' button to write down your thoughts , ideas and memories.`} 
                setOpenAddEditModel={()=>{
                  setOpenAddEditModel({
                    isShown:true,
                    type:'add',
                    data:null
                  })
                }} />
              </div>
            )}
          </div>
          <div className="w-[320px]">
            <div 
            className="bg-white border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker 
                captionLayout="dropdown"
                mode='range'
                selected={dateRange} 
                onSelect={handleDayClick}  
                pagedNavigation />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Add and Edit Story Modal */}
      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[70vw] md:w-[45vw] h-[100vh] bg-white rounded-lg mx-auto mt-8 p-5 overflow-y-scroll scrollbar-elegant z-50"
      >
        <AddEditTravelStory
          storyInfo={openAddEditModel.data}
          type={openAddEditModel.type}
          onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null })
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>


      {/* View Travel Story Modal */}
      <Modal 
      isOpen={openViewModel.isShown} 
      onRequestClose={()=>{}} 
      style={{
        overlay:{
          zIndex:999,
          backgroundColor:'rgba(0,0,0,0.2)'
        }
      }} 
      appElement={document.getElementById('root')} 
      className="w-[70vw] md:w-[45vw] h-[100vh] bg-white rounded-lg mx-auto mt-8 p-5 overflow-y-scroll scrollbar-elegant z-50" >
      
      <ViewTravelStory 
      type={openViewModel.type} 
      storyInfo={openViewModel.data} 
      onClose={()=>{
        setOpenViewModel((prevState)=>({
          ...prevState , 
          isShown:false}))
      }}  
      onEditClick={()=>{
        setOpenViewModel((prevState)=>({
          ...prevState,
          isShown:false}))
        handleEdit(openViewModel.data)
      }}
      onDeleteClick={()=>{
        deleteTravelStory(openViewModel.data || null);
      }}  />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-cyan-400 hover:bg-cyan-700 fixed right-10 bottom-10 cursor-pointer"
        onClick={() => {
          setOpenAddEditModel({ isShown: true, type: "add", data: null })
        }}
      >
        <IoMdAdd size={35} className="text-white text-[32px]" />
      </button>

      <ToastContainer 
        autoClose={2000} 
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default Home
