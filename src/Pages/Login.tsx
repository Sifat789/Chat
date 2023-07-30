// src/App.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../Firebase';


const Login: React.FC = () => {

  const [ email, setemail ] = useState<string>('')
  const [ password, setpassword ] = useState<string>('')
  const navigate = useNavigate()


  const handleLogin = async () => {
     try {
       const res = await signIn(email, password)
       if(res){
          navigate("/")
       }
     } catch(err) {
      alert("Login failed")
      console.log(err)
     }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white w-96 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  outline-none"
              placeholder="you@example.com"
              required
              onChange={(e) => setemail((e.target as HTMLInputElement).value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
              placeholder="********"
              required
              onChange={(e) => setpassword((e.target as HTMLInputElement).value)}
            />
          </div>
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-blue-500 text-white font-bold bg-primary rounded-md hover:bg-secondary focus:outline-none focus:ring focus:ring-secondary focus:ring-opacity-50"
          >
            Login
          </button>
        <h1 className='mt-4 flex items-center justify-center'>Don't have an Account? <Link to={'/signUp'}><button className='ml-2 text-blue-600 font-semibold'>SignUp</button></Link></h1>
      </div>
    </div>
  );
};

export default Login;
