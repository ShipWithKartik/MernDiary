import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import PrivateRoute from './Components/PrivateRoute';


const App = () => {

  return (
    <BrowserRouter>

      <Routes>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;


/*
We wrap the / route with PrivateRoute component , when a user visits / , React Router will render PrivateRoute component 
Then based on the logic inside the PrivateRoute , it either shows the actual page (Home) or redirects to /login
*/
