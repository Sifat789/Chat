import React, { useEffect, useState } from 'react'
import { convoUsersType } from '../Pages/Home'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/ReduxStore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../Firebase'

interface ConvoUserTemType {
    user: convoUsersType
}

interface recieverType {
    name: string
    isOnline: boolean
    profilePic: string
}

const ConvoUserTem: React.FC<ConvoUserTemType> = ({ user }) => {

    const currentUser = useSelector((state: RootState) => state.CurUserSlice)
    const [reciever, setreciever] = useState<recieverType>()

    const combineID = (): string => {
        if (user.recieverid && currentUser.id) {
            return user.recieverid.localeCompare(currentUser.id) <= 0 ? user.recieverid + currentUser.id : currentUser.id + user.recieverid;
        }
        else return ''

    }

    useEffect(() => {
        const getUser = async () => {
            const res = await getDoc(doc(db, 'UserInfo', user.recieverid))
            if (res.exists()) {
                setreciever({
                    name: res.data().name,
                    isOnline: res.data().isOnline,
                    profilePic: ''
                })
            }
        }

        getUser()
    }, [])

   console.log(user)

    return (
        <Link to={`/chatroom/${user.recieverid}/${combineID()}`}>
            <div className='border-2 border-solid border-red-400 bg-white shadow-lg flex space-x-6 items-center py-3 rounded-md justify-between'>
                <div className='flex items-center space-x-3'>
                    <span className='h-11 w-11 ml-3 flex items-center justify-center bg-blue-500 rounded-full'>{reciever?.name[0]}</span>
                    <div>
                        <h1 className='font-bold'>{reciever?.name}</h1>
                        <h1>{user.senderId === currentUser.id? `me: ${user.messase.text}` :  user.messase.text }</h1>
                    </div>
                </div>

                <div className=''>
                    {reciever?.isOnline ? 'online' : 'offline'}
                </div>
            </div>
        </Link>
    )
}

export default ConvoUserTem