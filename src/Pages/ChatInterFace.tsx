import React, { useEffect, useState } from 'react'
import MessageTem from '../Components/MessageTem'
import MessageTemRight from '../Components/MessageTemRight'
import { Link, useParams } from 'react-router-dom'
import { FieldValue, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore'
import { auth, db } from '../Firebase'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Redux/ReduxStore'
import { onAuthStateChanged } from 'firebase/auth'
import { setCurUser } from '../Redux/CurUserSlice'

interface InputmessageType {
  text: string
  img: string
}
export interface messagesType {
  message: string
  id: string
  date: string
  img: string
  senderId: string
}

export interface receiverUserType {
  name: string
  isOnline: boolean
  joined: string
  email: string
}

const ChatInterFace = () => {

  const { recieverId, combineID } = useParams()
  const currentUser = useSelector((state: RootState) => state.CurUserSlice)
  const [Inputmessage, setInputmessage] = useState<InputmessageType>()
  const [messages, setmessages] = useState<messagesType[]>()
  const [isNewChat, setisNewChat] = useState<Boolean>(false)
  const [receiverUser, setreceiverUser] = useState<receiverUserType>()
  const dispatch = useDispatch()

  // const combineID = (): string => {
  //   if (recieverId.id) {
  //     if (recieverId.id > currentUser.id) return recieverId.id + currentUser.id
  //     else return currentUser.id + recieverId.id
  //   }
  //   else return ''
  // }
  // const combineID = (): string => {
  //   if (recieverId.id && currentUser.id) {
  //     return recieverId.id.localeCompare(currentUser.id) <= 0 ? recieverId.id + currentUser.id : currentUser.id + recieverId.id;
  //   }
  //   else return ''

  // }



  const generateRandomString = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user?.displayName) {
        dispatch(setCurUser({
          name: user?.displayName,
          id: user?.uid
        }))
      }
    })

    const getReceiver = async () => {
      if (recieverId) {
        const recceiveruser = await getDoc(doc(db, 'UserInfo', recieverId))
        if (recceiveruser.exists()) {
          console.log('recuser', recceiveruser.data())
          setreceiverUser({
            name: recceiveruser.data().name,
            isOnline: recceiveruser.data().isOnline,
            joined: recceiveruser.data().joinedAt,
            email: recceiveruser.data().email
          })
        }
      }
    }
    getReceiver()
  }, [])

  useEffect(() => {
    const getMessages = async () => {
      if(combineID) {
        const docRef = doc(db, 'UserChats', combineID)
      console.log('ref',docRef)
      const docSnap = await getDoc(docRef);
      console.log('docsnap',docSnap.data())

      if (docSnap.exists()) {
        setisNewChat(false)
        const messagesTmp: messagesType[] = []
        docSnap.data().messages.map((doc: messagesType) => {
          messagesTmp.push({
            message: doc.message,
            id: doc.id,
            img: doc.img,
            date: doc.date,
            senderId: doc.senderId
          })
        })
        setmessages(messagesTmp)
        console.log(docSnap.data())
      }
      
      } else {
        setisNewChat(true)
      }
    }

    getMessages()
  }, [])

  console.log('messages',messages)

  const handleSend = async () => {
    if (isNewChat && combineID) {
      try {
        await setDoc(doc(db, 'UserChats', combineID), {
          messages: [{
            message: Inputmessage?.text,
            img: Inputmessage?.img,
            senderId: currentUser.id,
            date: Timestamp.now(),
            id: generateRandomString()
          }]
        })
        setInputmessage({ text: '', img: '' })
        setisNewChat(false)
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        if(combineID) {
          await updateDoc(doc(db, 'UserChats', combineID), {
            messages: arrayUnion({
              message: Inputmessage?.text,
              img: Inputmessage?.img,
              senderId: currentUser.id,
              date: Timestamp.now(),
              id: generateRandomString()
            })
          })
  
          setInputmessage({ text: '', img: '' })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div className='border-2 h-[100vh] relative border-solid border-red-500'>
      <Link to={'/'}>Back</Link>
      <div className='border-solid border-pink-500 border-2 h-[85%] overflow-y-auto bg-white flex flex-col space-y-12 scrollbar-none'>
        {
          messages?.map((message) => {
            if (message.senderId === currentUser.id) {
              return <MessageTemRight message={message} key={message.id} />
            }
            else {
              if(receiverUser)
              return <MessageTem message={message} receiverUser={receiverUser} key={message.id} />
            }
          })
        }


      </div>

      <div className='absolute bottom-1 flex justify-between border-solid border-green-500 border-2 w-[99vw]'>
        <input value={Inputmessage?.text} onChange={(e) => setInputmessage({ text: (e.target as HTMLInputElement).value, img: '' })} className='w-[90%] h-10' type="text" />
        <button onClick={handleSend} className=''>Send</button>
      </div>
    </div>
  )
}

export default ChatInterFace