import React, { useState, useEffect } from 'react';
import UserTem from '../Components/UserTem';
import { auth, logOut } from '../Firebase';
import { onAuthStateChanged } from 'firebase/auth/cordova';
import { useNavigate } from 'react-router-dom';
import UserTemWithoutMes from '../Components/UserTemWithoutMes';
import { collection, query, where, getDocs, or, Timestamp, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../Firebase';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/ReduxStore';
import { setCurUser } from '../Redux/CurUserSlice';
import ConvoUserTem from '../Components/ConvoUserTem';
import { OnlineStatus } from '../CustomHooks/OnlineStatus';
import SearchIcon from '../assets/SearchIcon';

interface searchUsersType {
  name: string
  isOnline: boolean
  id: string
}

export interface convoUsersType {
  messase: {
    img: string
    text: string
  },
  timestamp: Timestamp,
  haveIseenIt: boolean,
  senderId: string,
  recieverid: string
}

const Home: React.FC = () => {


  const [SearchInput, setSearchInput] = useState<string>('')
  const [SearchUsers, setSearchUsers] = useState<searchUsersType[]>()
  const [convoUsers, setconvoUsers] = useState<convoUsersType[]>()
  const currentUser = useSelector((state: RootState) => state.CurUserSlice)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleSignOut = () => {
    logOut()
  }

  function formatDateToLocal(timestamp: any) {
    // Convert the Firestore Timestamp to a JavaScript Date object
    const date = timestamp.toDate();

    // Get the local date and time string in the format "30 July 2023, 15:12:25"
    const localDateTimeString = date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    return localDateTimeString;
  }

  const handleSearch = async () => {
    const q = query(collection(db, "UserInfo"), or(where("name", "==", SearchInput), where("email", "==", SearchInput)));
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

  //checking if user exists
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      } else {
        if (user.displayName) {
          dispatch(setCurUser({
            name: user.displayName,
            id: user.uid,
          }));
        }
        // console.log(user);
      }
    });

    return () => unsubscribe();
  }, []);

  //getting convo
  useEffect(() => {
    const getConvo = async () => {
      if (currentUser.id) {
        const q = query(collection(db, 'latestMessages', currentUser.id, 'latest'), orderBy('timestamp', 'desc'))
        const unsub = onSnapshot(q, (querySnapshot) => {
          const convoUsersTmp: convoUsersType[] = []
          querySnapshot.forEach((doc) => {
            convoUsersTmp.push({
              messase: doc.data().message,
              timestamp: formatDateToLocal(doc.data().timestamp),
              haveIseenIt: doc.data().haveIseenIt,
              senderId: doc.data().senderId,
              recieverid: doc.id
            })
          })
          setconvoUsers(convoUsersTmp)
        })

        return unsub
      }
    }
    getConvo()
  }, [currentUser])


  OnlineStatus({currentUser})




  return (
    <div className='bg-gray-100'>
      <h1 className='font-bold text-2xl mb-2'>Sifat Chat</h1>

      {
        currentUser ? <UserTemWithoutMes name={currentUser.name} id={currentUser.id} /> : ''
      }

      <button onClick={handleSignOut} className='bg-blue-500 rounded-md text-white font-semibold px-2 py-1 mt-2'>SignOut</button>

      <div className='mt-8 flex flex-col justify-center items-center'>
        <h1 className='font-semibold text-lg'>Find a User</h1>
        <div className='flex mb-2 bg-white rounded-full px-3 py-2'>
          <input className='w-[80vw] sm:w-[35vw] text-lg outline-none' onChange={(e) => setSearchInput((e.target as HTMLInputElement).value)} placeholder='Search by name or email...' type="text" />
          <button onClick={handleSearch} ><SearchIcon/></button>
        </div>
      </div>

      {
         SearchUsers?.map(user => {
          return <UserTem user={user} lastmessage={''} key={user.id} />
        })
      }



      <div className='mt-12 '>
        <h1 className='font-bold mb-2 text-2xl'>Coversations</h1>
        <div className=' h-[73vh] overflow-y-auto flex flex-col space-y-5 scrollbar-none'>
          {
            convoUsers?.map((user) => {
              return <ConvoUserTem user={user} key={user.recieverid} />
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
