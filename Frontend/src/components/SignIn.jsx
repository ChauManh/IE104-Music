
import React from 'react';

const handleClick = () => {
  alert("Chưa kết nối CSDL đâu nha!");
}

function SignIn() {
  return (
    <div className='flex flex-col items-center w-full min-h-screen py-8 gap-4'>
      <header>
        <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
             alt="spotify" className='w-[50px] h-[50px]' />
      </header>
      
    {/* Continue */}

      <section className='h-[33.33%]'>
        <h1 className='text-3xl font-bold text-white mb-6 text-center '>Log in to Spotify</h1>
        <div className='flex flex-col gap-4 w-[300px] justify-center'>
          <button className=' text-white py-2 px-4 rounded-md w-full flex items-center border border-gray-500 transition duration-150
              hover:border-green-300'>
            <img src="https://accounts.scdn.co/sso/images/new-google-icon.72fd940a229bc94cf9484a3320b3dccb.svg" alt="Google" className='mr-10'/>
            Continue with Google
          </button>
          <button className=' text-white py-2 px-4 rounded-md w-full flex items-center border border-gray-500 transition duration-150
              hover:border-green-300'>
            <img src="https://accounts.scdn.co/sso/images/new-facebook-icon.eae8e1b6256f7ccf01cf81913254e70b.svg" alt=""  className='mr-8'/>
            Continue with Facebook
          </button>
          <button className=' text-white py-2 px-4 rounded-md w-full flex items-center border border-gray-500 transition duration-150
              hover:border-green-300'>
            <img src="https://accounts.scdn.co/sso/images/new-apple-icon.e356139ea90852da2e60f1ff738f3cbb.svg" alt=""  className='mr-11'/>
            Continue with Apple
          </button>
          <button className='flex items-center justify-center text-white py-2 rounded-md border border-gray-500 transition duration-150
              hover:border-green-300'>
            Continue with phone number
          </button>
        </div>

      {/* Line */}

        <div className="flex items-center m-[16px]">
          <hr className="w-full border-gray-600" />
        </div>

      {/* Form */}

        <div className='text-white w-[300px]'>
          <form>
            <div className='mb-4'>
              <label>Email or username</label>
              <input className='w-full bg-transparent border border-gray-500 p-2 rounded-md mt-2 transition duration-200
              hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300'
                     type="text" placeholder='Email or username' required />
            </div>
            <div className='mb-6'>
              <label>Password</label>
              <input className='w-full bg-transparent border border-gray-500 p-2 rounded-md mt-2 transition duration-200
              hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-300'
                     type="password" placeholder='Password' required />
            </div>

            <button onClick={handleClick}
                    className='w-full py-3 bg-[#32c967] text-black font-bold rounded-full hover:bg-[#3bef7a] hover:scale-105 mb-4'>
              Log In
            </button>
          </form>
        </div>
        <div className='text-gray-400'>
          <div className='mb-4 flex justify-center'>
            <a href="#" className='text-white underline mt-1'>Forgot password?</a>
          </div>
          <p>Don't have an account?
            <a href="#" className='text-white underline ml-1'>Sign up for Spotify</a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default SignIn;
