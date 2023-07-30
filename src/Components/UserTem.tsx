import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/ReduxStore'

interface UserTemType {
  user: {
    name: string
    isOnline: boolean
    id: string
  }
  lastmessage: string
}

const UserTem: React.FC<UserTemType> = ({ user, lastmessage }) => {

  const currentUser = useSelector((state:RootState)  => state.CurUserSlice)

  const combineID = (): string => {
    if (user.id && currentUser.id) {
      return user.id.localeCompare(currentUser.id) <= 0 ? user.id + currentUser.id : currentUser.id + user.id;
    }
    else return ''

  }

  return (
    <Link to={`/chatroom/${user.id}/${combineID()}`}>
      <div className='border-2 border-solid border-red-400 bg-white shadow-lg flex space-x-6 items-center py-3 rounded-md justify-between'>
        <div className='flex items-center space-x-3'>
          <span className='h-11 w-11 ml-3 flex items-center justify-center bg-blue-500 rounded-full'>S</span>
          <div>
            <h1 className='font-bold'>{user.name}</h1>
            <h1>{lastmessage}</h1>
          </div>
        </div>

        <div className=''>
          {user.isOnline ? 'online' : 'offline'}
        </div>
      </div>
    </Link>
  )
}

export default UserTem