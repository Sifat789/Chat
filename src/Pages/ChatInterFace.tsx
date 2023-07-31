import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import MessageTem from '../Components/MessageTem'
import MessageTemRight from '../Components/MessageTemRight'
import { Link, useParams } from 'react-router-dom'
import { FieldValue, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp, Timestamp, onSnapshot } from 'firebase/firestore'
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
  date: Timestamp
  img: string
  senderId: string
}

export interface receiverUserType {
  name: string
  isOnline: boolean
  joined: string
  email: string
  profilePic: string
}

const ChatInterFace = () => {

  const { recieverId, combineID } = useParams()
  const currentUser = useSelector((state: RootState) => state.CurUserSlice)
  const [Inputmessage, setInputmessage] = useState<InputmessageType>()
  const [messages, setmessages] = useState<messagesType[]>()
  const [isNewChat, setisNewChat] = useState<Boolean>(false)
  const [receiverUser, setreceiverUser] = useState<receiverUserType>()
  const [isSendClicked, setisSendClicked] = useState<boolean>(false)
  const scrollRefMounted = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch()



  const generateRandomString = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  const scroll = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' })
  }

  //Getting users
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
          setreceiverUser({
            name: recceiveruser.data().name,
            isOnline: recceiveruser.data().isOnline,
            joined: recceiveruser.data().joinedAt,
            email: recceiveruser.data().email,
            profilePic: recceiveruser.data().profilePic
          })
        }
      }
    }
    getReceiver()
  }, [])

  //scroll
  useEffect(() => {
    scroll()
  }, [scrollRefMounted.current])


  //Getting previous messages
  useEffect(() => {
    const getMessages = async () => {
      if (combineID) {
        const docRef = doc(db, 'UserChats', combineID)
        const docSnap = await getDoc(docRef);
        console.log(docSnap.exists())

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
        } else {
          setisNewChat(true)
        }

      }
    }

    getMessages()
  }, [])

  useEffect(() => {
    messages?.map((message, index) => {
      if (index + 1 === messages.length) {
        if (currentUser.id && recieverId)
          updateDoc(doc(db, 'latestMessages', currentUser.id, 'latest', recieverId), {
            haveIseenIt: true
          })
      }
    })
  }, [messages])



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
        if (Inputmessage) {
          const messagesTmp: messagesType[] = []
          messagesTmp.push({
            message: Inputmessage.text,
            img: Inputmessage.img,
            senderId: currentUser.id,
            date: Timestamp.now(),
            id: generateRandomString()
          })
          setmessages(messagesTmp)
          scroll()
          if (currentUser.id && recieverId) {
            await setDoc(doc(db, 'latestMessages', currentUser.id, 'latest', recieverId), {
              message: Inputmessage,
              timestamp: Timestamp.now(),
              haveIseenIt: true,
              senderId: currentUser.id,
            })

            await setDoc(doc(db, 'latestMessages', recieverId, 'latest', currentUser.id), {
              message: Inputmessage,
              timestamp: Timestamp.now(),
              haveIseenIt: false,
              senderId: currentUser.id,
            })
          }
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        if (combineID) {
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
          if (messages && Inputmessage) {
            const messagesTmp: messagesType[] = messages
            messagesTmp.push({
              message: Inputmessage.text,
              img: Inputmessage.img,
              senderId: currentUser.id,
              date: Timestamp.now(),
              id: generateRandomString()
            })
            setmessages(messagesTmp)
            scroll()
          }
        }

        if (currentUser.id && recieverId) {
          await setDoc(doc(db, 'latestMessages', currentUser.id, 'latest', recieverId), {
            message: Inputmessage,
            timestamp: Timestamp.now(),
            haveIseenIt: true,
            senderId: currentUser.id,
          })

          await setDoc(doc(db, 'latestMessages', recieverId, 'latest', currentUser.id), {
            message: Inputmessage,
            timestamp: Timestamp.now(),
            haveIseenIt: false,
            senderId: currentUser.id,
          })
        }

      } catch (err) {
        console.log(err)
      }
    }
  }

  console.log(isNewChat)

  return (
    <div className='border-2 h-[100vh] relative border-solid border-red-500'>
      <Link to={'/'}>Back</Link>
      <div className='border-solid border-pink-500 border-2 h-[88%] overflow-y-auto bg-white flex flex-col space-y-12 scrollbar-none'>
        {
          messages?.map((message, index) => {
            if (message.senderId === currentUser.id) {
              if (messages.length === index + 1) {
                scrollRefMounted.current=true
                return <div>
                  <MessageTemRight message={message} key={message.id} />
                  <div ref={scrollRef} className='bg-transparent'>
                    <h1 className='text-9xl text-transparent'>Sifat Chat</h1>
                  </div>
                </div>
              }
              else return <MessageTemRight message={message} key={message.id} />
            }
            else {
              if (receiverUser) {
                if (messages.length === index + 1) {
                  scrollRefMounted.current=true
                  return <div>
                    <MessageTem message={message} receiverUser={receiverUser} key={message.id} />
                    <div ref={scrollRef} className='bg-transparent'>
                      <h1 className='text-9xl text-transparent'>Sifat Chat</h1>
                    </div>
                  </div>
                }
                else return <MessageTem message={message} receiverUser={receiverUser} key={message.id} />
              }

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