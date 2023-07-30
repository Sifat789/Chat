import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signUp } from '../Firebase';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../Firebase';
import { updateProfile } from 'firebase/auth';

const SignUp: React.FC = () => {

  const [email, setemail] = useState<string>('')
  const [name, setname] = useState<string>('')
  const [password, setpassword] = useState<string>('')
  const navigate = useNavigate()

  const handleSignUp = async () => {
    try {
      const res = await signUp(email, password)
      if (res && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name
        })
        console.log(res.user)
        await setDoc(doc(db, 'UserInfo', res.user.uid), {
          name: name,
          joinedAt: serverTimestamp(),
          isOnline: true,
          email:email
        })
        navigate("/login")
      }
    } catch (err) {
      alert("SignUp failed")
      console.log(err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white w-96 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>




        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            placeholder="John Doe"
            required
            onChange={(e) => setname((e.target as HTMLInputElement).value)}
          />
        </div>



        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            placeholder="********"
            required
            onChange={(e) => setpassword((e.target as HTMLInputElement).value)}
          />
        </div>



        <button
          type="submit"
          onClick={() => handleSignUp()}
          className="w-full py-2 px-4 text-white font-bold bg-primary rounded-md hover:bg-secondary focus:outline-none focus:ring focus:ring-secondary focus:ring-opacity-50 bg-blue-500"
        >
          Sign Up
        </button>

        <h1 className='mt-4 flex items-center justify-center'>Already have an Account? <Link to={'/login'}><button className='ml-2 text-blue-600 font-semibold'>Login</button></Link></h1>
      </div>
    </div>
  );
};

export default SignUp;
