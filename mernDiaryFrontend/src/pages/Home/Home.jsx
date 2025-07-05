import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../Components/TravelStoryCard";
import { ToastContainer ,toast} from "react-toastify";

const Home = () => {
  const [allStories, setAllStories] = useState([]);

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/story/get-all");
      console.log(response.data.stories);

      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("Error fetching travel stories:", error);
    }
  };

  const handleEdit = async (item) => {};

  const handleViewStory = (item) => {};

  // Updated function to take storyId instead of full object
  const updateIsFavorite = async (storyId) => {
    // Get the current story from state to ensure we have the latest data
    const currentStory = allStories.find((story) => story._id === storyId);
    if (!currentStory) return;

    const newFavoriteStatus = !currentStory.isFavorite;

    try {
      const response = await axiosInstance.put(
        "/story/update-is-favourite/" + storyId,
        {
          isFavorite: newFavoriteStatus,
        }
      );

      console.log("API response:", response.data);

      // Update state regardless of what the API returns (optimistic update)
      setAllStories((prevStories) =>
        prevStories.map((story) =>
          story._id === storyId
            ? { ...story, isFavorite: newFavoriteStatus }
            : story
        )
      );

      if(response?.data?.updatedStory)
        toast.success('Story Updated Successfully!');

    } catch (error) {
      console.error("Error updating favorite status:", error);
      // Revert the change if API call fails
      setAllStories((prevStories) =>
        prevStories.map((story) =>
          story._id === storyId
            ? { ...story, isFavorite: !newFavoriteStatus }
            : story
        )
      );
      toast.error('There was Some Error');
      console.log("Something went wrong. Please try again!");
    }
  };

  useEffect(() => {
    getAllTravelStories();
  }, []);

  return (
    <div>
      <NavBar />

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div>
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
                      onClick={() => handleViewStory(item)}
                      onFavoriteClick={() => updateIsFavorite(item._id)}
                    />
                  );
                })}
              </div>
            ) : (
              <div>Empty Card Here</div>
            )}
          </div>

          <div className="w-[320px]"></div>
        </div>
      </div>

      <ToastContainer 
      autoClose={2500}/>

    </div>
  );
};

export default Home;


/*
When the user clicks the hear icon on the story image , we call a updateIsFavorite(item) 
Here's where the problem begins -:

-> Initial Render:
We have a story object {_id:'1',title:'Story1',isFavorite:false}
We render a card for it 

()=>updateIsFavorite(item) is a closure  
It remembers the item object that existed at the time of this render 
So it's locked into that specific object in memory


-> User Click the Heart icon:
App Sends a request to the server to toggle isFavorite
Updates the React state with a new version of the story:
{_id:'1',title:'Story 1',isFavorite:true}
Calls setAllStories(newData) -> triggers a re-render


-> React is slow to Re-render:
If user clicks the heart icon again before the re-render finishes , the app still uses the old closure ,which is tied to the old item object where isFavorite is false.


-> The Closure is Frozen:
The old closure still says ()=>updateIsFavorite(oldStoryObject)
So on second click:
updateIsFavorite(oldStoryObject)
!oldStoryObject.isFavorite = true again
But the server already updated it to true , so now we try to set it to true again but already is , so nothing changes visually 


What is a Stale Closure ?
A Stale closure means:
We are using a function (closure) that still refers to the old data
Even though the app's state has new , updated data , that function doesn't know it yet.

This usually happends between:
A state update
And the re-render completing 

In that small window , your UI can run with outdated logic

Best Practices:Avoid Passing Object References in Closures , instead pass id

IDs are primitive (string/numbers)
Closures store copies of primitives , not references 
We can always fetch the latest story object using that ID

*/

