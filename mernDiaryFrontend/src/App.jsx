import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Home from './pages/Home/Home';


const App = () => {

  return (

    <div>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/sign-up' element={<SignUp />} />

        </Routes>
      </BrowserRouter>

    </div>

  )
  
}

export default App;