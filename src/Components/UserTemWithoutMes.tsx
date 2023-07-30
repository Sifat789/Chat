import React from 'react'
import { Link } from 'react-router-dom'

interface UserTemWithoutMes {
  name: string
  id: string
}

const UserTemWithoutMes: React.FC<UserTemWithoutMes> = ({ name, id }) => {
  return (
    
      <div className='border-2 border-solid border-red-400 bg-white shadow-lg flex space-x-6 items-center py-3 rounded-md'>
        <span className='h-11 w-11 ml-3 flex items-center justify-center bg-blue-500 rounded-full'>{name[0]}</span>
        <div>
          <h1 className='font-bold'>{name}</h1>
        </div>
      </div>
  )
}

export default UserTemWithoutMes