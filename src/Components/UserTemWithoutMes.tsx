import React, { useEffect, useState } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../Firebase'
import { recieverType } from './ConvoUserTem'

interface UserTemWithoutMes {
  name: string
  id: string
}

const UserTemWithoutMes: React.FC<UserTemWithoutMes> = ({ name, id }) => {

  const [reciever, setreciever] = useState<recieverType>()

  useEffect(() => {
    if (id) {
      const unsub = onSnapshot(doc(db, 'UserInfo', id), (doc) => {
        if (doc.exists()) {
          setreciever({
            name: doc.data().name,
            isOnline: doc.data().isOnline,
            profilePic: doc.data().profilePic
          })
        }
      })

      return unsub
    }
  }, [])
  return (

    <div className=' bg-white shadow-lg flex space-x-6 items-center py-3 rounded-md'>
      <div className='flex'>
        <span className='h-11 w-11 ml-3 flex items-center justify-center bg-blue-500 rounded-full'>{name? name[0] : reciever?.name[0]}</span>
        {
          reciever?.isOnline ? (
            <span className='self-end h-3 w-3 border-2  border-white border-solid relative right-3 rounded-full bg-green-500'></span>
          ) : ('')
        }
      </div>
      <div>
        <h1 className='font-bold'>{name? name : reciever?.name}</h1>
      </div>
    </div>
  )
}

export default UserTemWithoutMes