import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {

    const {currentUser} = useSelector((state)=>state.user);
    // Read the currentUser from the Redux store using useSelector hook

  return currentUser ? <Outlet /> : <Navigate to = {'/login'}/>;
}

export default PrivateRoute;


// Outlet is a placeholder for the child routes inside a nested <Route> 
