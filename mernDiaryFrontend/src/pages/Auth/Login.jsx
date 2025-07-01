import React from 'react';

const Login = () => {

  return (

    <div className="h-screen bg-cyan-50 overflow-hidden relative">

        <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        
            <div className='w-2/4 h-[90vh] flex items-end bg-cover bg-center rounded-lg p-10 z-50'
            style={{
            backgroundImage: "url('https://images.pexels.com/photos/586687/pexels-photo-586687.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')"
            }}>
                <div>
                    <h4>Create Your <br/>Stories</h4>
                    <p>Record your travel experiences and memories in your travel journey</p>
                </div>

            </div>

            <div className=''>
                <form>
                    <h4 className='text-2xl fontsemibold mb-7'>Login</h4>

                    <input type='email' placeholder='Email' className='input-box' />

                    <button type='submit'>
                        LOGIN
                    </button>

                    <p className=''>Or</p>

                    <button type='submit'>
                        CREATE ACCOUNT
                    </button>

                </form>
            </div>

        </div>
      
    </div>
  );
};

export default Login;
