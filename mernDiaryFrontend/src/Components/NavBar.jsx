import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/slice/userSlice";
import SearchBar from "./SearchBar";

const NavBar = ({searchQuery , setSearchQuery , handleClearSearch , onSearchStory}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      const response = await axiosInstance.get("/user/signout");

      if (response.data) {
        dispatch(signOutSuccess());

        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Search = ()=>{
    if(searchQuery){
      onSearchStory(searchQuery);
    }
  }
  const Clear =()=>{
    handleClearSearch();
    setSearchQuery('');
  }


  return (
    <div className="bg-white flex items-center justify-between px-10 py-4 shadow-lg border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <Link to={"/"}>
        <h1 className="font-bold text-2xl sm:text-2xl flex flex-wrap">
          <span className="text-blue-400">Travel</span>
          <span className="text-blue-800">Diary</span>
        </h1>
      </Link>


      <SearchBar 
      value={searchQuery} 
      onChange={(event)=>{
        setSearchQuery(event.target.value);
      }}
      Search={Search} 
      Clear={Clear} />

      <Profile onLogout={onLogout} />
    </div>
  );
};

export default NavBar;
