import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/ReduxStore'

interface UserTemType {
  user: {
    name: string
    isOnline: boolean
    id?: string
    joined?: string
    email?: string
    profilePi?: string
  }
  lastmessage: string
}

const UserTem: React.FC<UserTemType> = ({ user, lastmessage }) => {

  const currentUser = useSelector((state: RootState) => state.CurUserSlice)

  const combineID = (): string => {
    if (user.id && currentUser.id) {
      return user.id.localeCompare(currentUser.id) <= 0 ? user.id + currentUser.id : currentUser.id + user.id;
    }
    else return ''

  }

  return (
    <Link to={ user.id === currentUser.id? '/' : `/chatroom/${user.id}/${combineID()}` }>
      <div className=' bg-white shadow-lg flex space-x-6 items-center py-3 rounded-md justify-between'>
        <div className='flex items-center space-x-3'>

          <div className='flex'>
            <span className='h-11 w-11 ml-3 flex items-center justify-center bg-blue-500 rounded-full'>{user.name[0]}</span>
            {
              user?.isOnline ? (
                <span className='self-end h-3 w-3 border-2  border-white border-solid relative right-3 rounded-full bg-green-500'></span>
              ) : ('')
            }
          </div>

          <div>
            <h1 className='font-bold'>{user.name}</h1>
            <h1>{lastmessage}</h1>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default UserTem