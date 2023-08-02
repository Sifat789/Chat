import React, { useEffect, useState } from 'react'
import { convoUsersType } from '../Pages/Home'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/ReduxStore'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../Firebase'

interface ConvoUserTemType {
    user: convoUsersType
}

export interface recieverType {
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

    //getting live onlineStatus
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'UserInfo', user.recieverid), (doc) => {
            if (doc.exists()) {
                setreciever({
                    name: doc.data().name,
                    isOnline: doc.data().isOnline,
                    profilePic: doc.data().profilePic
                })
            }
        })

        return unsub
    }, [])

    const handleMessageLength = (message: string) => {
        if(message.length>20) return `${message.slice(0,20)}...`
        else return message
    }


    return (
        <Link to={`/chatroom/${user.recieverid}/${combineID()}`}>
            <div className=' bg-white shadow-lg flex space-x-6 items-center py-3 rounded-md justify-between'>
                <div className='flex items-center space-x-3'>
                    <div className='flex'>
                        <span className='h-11 w-11 ml-3 flex items-center justify-center bg-blue-500 rounded-full'>{reciever?.name[0]}</span>
                        {
                            reciever?.isOnline ? (
                                <span className='self-end h-3 w-3 border-2  border-white border-solid relative right-3 rounded-full bg-green-500'></span>
                            ) : ('')
                        }
                    </div>

                    <div>
                        <h1 className={user.haveIseenIt? 'text-gray-800 font-semibold' : 'text-black font-bold'}>{reciever?.name}</h1>
                        <h1 className={user.haveIseenIt? 'text-gray-800 font-medium text-sm' : 'font-bold'} >{user.senderId === currentUser.id ? `You: ${handleMessageLength(user.messase.text)}` : handleMessageLength(user.messase.text)}</h1>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ConvoUserTem