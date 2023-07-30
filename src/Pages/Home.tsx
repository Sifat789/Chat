import React, { useState, useEffect } from 'react';
import UserTem from '../Components/UserTem';
import { auth, logOut } from '../Firebase';
import { onAuthStateChanged } from 'firebase/auth/cordova';
import { useNavigate } from 'react-router-dom';
import UserTemWithoutMes from '../Components/UserTemWithoutMes';
import { collection, query, where, getDocs, or } from "firebase/firestore";
import { db } from '../Firebase';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/ReduxStore';
import { setCurUser } from '../Redux/CurUserSlice';

interface currentUserType {
  name: string
  id: string
}
interface searchUsersType {
  name: string
  isOnline: boolean
  id: string
}

const Home: React.FC = () => {


  const [ SearchInput, setSearchInput ] = useState<string> ('')
  const [ SearchUsers, setSearchUsers ] = useState<searchUsersType[]> ()
  // const [ currentUser, setcurrentuser ] = useState<currentUserType>()
  const currentUser = useSelector((state:RootState)  => state.CurUserSlice)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleSignOut = () => {
    logOut()
  }
  
  const handleSearch = async () => {
     const q = query(collection(db, "UserInfo"), or (where("name", "==", SearchInput), where("email", "==", SearchInput)));
      const SearchUsersTmp: searchUsersType[] = []
     const querysnapshot = await getDocs(q)
     querysnapshot.forEach((doc) => {
          SearchUsersTmp.push({
            name: doc.data().name,
            isOnline: doc.data().isOnline,
            id: doc.id
          })
     })

     setSearchUsers(SearchUsersTmp)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      } else {
        if (user.displayName) {
          dispatch( setCurUser({
            name: user.displayName,
            id: user.uid,
          }));
        }
        // console.log(user);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className='bg-gray-100'>
      <h1 className='font-bold text-2xl mb-2'>Sifat Chat</h1>
      
      {
         currentUser ? <UserTemWithoutMes name={currentUser.name} id={currentUser.id} /> : ''
      }

      <button onClick={handleSignOut} className='bg-blue-500 rounded-md text-white font-semibold px-2 py-1 mt-2'>SignOut</button>

      <div className='mt-8'>
        <h1 className='font-semibold text-lg'>Find a User</h1>
        <div className='flex mb-2'>
          <input onChange={(e) => setSearchInput((e.target as HTMLInputElement).value)} placeholder='Search' type="text" />
          <button onClick={handleSearch} >Search</button>
        </div>
        {
           SearchUsers?.map(user => {
              return <UserTem user={user} lastmessage={''} key={user.id}/>
           })
        }
      </div>



      <div className='mt-12 '>
        <h1 className='font-bold mb-2 text-2xl'>Coversations</h1>
        <div className='border-solid border-pink-500 border-2 h-[73vh] overflow-y-auto flex flex-col space-y-5 scrollbar-none'>
          hello
        </div>
      </div>
    </div>
  );
};

export default Home;
