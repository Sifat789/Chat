import { useEffect, useState, useRef } from 'react'
import MessageTem from '../Components/MessageTem'
import MessageTemRight from '../Components/MessageTemRight'
import { Link, useParams } from 'react-router-dom'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, Timestamp, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../Firebase'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Redux/ReduxStore'
import { onAuthStateChanged } from 'firebase/auth'
import { setCurUser } from '../Redux/CurUserSlice'
import { OnlineStatus } from '../CustomHooks/OnlineStatus'
import UserTemWithoutMes from '../Components/UserTemWithoutMes'
import BackIcon from '../assets/BackIcon'
import SendIcon from '../assets/SendIcon'

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
  const [InputmessageTmp, setInputmessageTmp] = useState<InputmessageType>()
  const [messages, setmessages] = useState<messagesType[]>()
  const [isNewChat, setisNewChat] = useState<Boolean>(false)
  const [receiverUser, setreceiverUser] = useState<receiverUserType>()
  const scrollRefMounted = useRef<boolean>(false)
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch()
  const InputmessageRef = useRef<HTMLInputElement>(null)



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

  const getFirstWord = (str:string) => {
    const words = str.trim().split(/\s+/);
    return words[0];
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
  }, [messages])


  //Getting previous messages
  useEffect(() => {
    const getMessages = async () => {
      if (combineID) {
        const docRef = doc(db, 'UserChats', combineID)
        const docSnap = await getDoc(docRef);

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


    // InputmessageRef.current?.focus()
  }, [])

  //updating haveIseenIt
  useEffect(() => {
    messages?.map((message, index) => {
      if (index + 1 === messages.length) {
        if (currentUser.id && recieverId) {
          const update = async () => {
            try {
              await updateDoc(doc(db, 'latestMessages', currentUser.id, 'latest', recieverId), {
                haveIseenIt: true
              })
            } catch (err) {
              console.log(message)
              console.log(err)
            }
          }

          update()
        }
      }
    })
  }, [messages])


  //getting live messages
  useEffect(() => {
    if (combineID) {
      const docRef = doc(db, 'UserChats', combineID)
      const unsub = onSnapshot(docRef, (doc) => {
        console.log('n')
        const messagesTmp: messagesType[] = []
        if (doc.exists()) {
          doc.data().messages.map((message: messagesType) => {
            messagesTmp.push(message)
          })
          setmessages(messagesTmp)
        }
        if (messagesTmp.length !== 0) {
          setisNewChat(false)
        }
      })

      return unsub
    }
  }, [])


  OnlineStatus({ currentUser })


  //handling send
  useEffect(() => {
    const handleSend = async () => {
      if (!Inputmessage) return
      if (isNewChat && combineID) {
        console.log('new')
        try {
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

            await setDoc(doc(db, 'UserChats', combineID), {
              messages: [{
                message: Inputmessage?.text,
                img: Inputmessage?.img,
                senderId: currentUser.id,
                date: Timestamp.now(),
                id: generateRandomString()
              }]
            })
          }
          setisNewChat(false)
          
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          if (combineID) {
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

              await updateDoc(doc(db, 'UserChats', combineID), {
                messages: arrayUnion({
                  message: Inputmessage?.text,
                  img: Inputmessage?.img,
                  senderId: currentUser.id,
                  date: Timestamp.now(),
                  id: generateRandomString()
                })
              })

              
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
    }

    handleSend()
  }, [Inputmessage])

  return (
    <div className=' h-[95vh] sm:h-[100vh] relative'>
      <div className='flex bg-white'>
        <button className=''>
          <Link to={'/'}><BackIcon /></Link>
        </button>

        <div>
          {recieverId ? <UserTemWithoutMes name={''} id={recieverId} /> : ''}
        </div>
      </div>
      <div className={ isNewChat? 'flex items-end justify-center h-[78%]' : 'relative h-[78%] overflow-y-auto bg-white flex flex-col space-y-12 scrollbar-none'}>
        {
          messages?.map((message, index) => {
            if (index + 1 === messages.length) {
              if (scrollRefMounted.current) scrollRefMounted.current = false
              else scrollRefMounted.current = true
            }
            if (message.senderId === currentUser.id) {
              if (messages.length === index + 1) {
                if (scrollRefMounted.current) scrollRefMounted.current = false
                else scrollRefMounted.current = true
                return <div ref={scrollRef}>
                  <MessageTemRight message={message} key={message.id} />

                </div>
              }
              else return <MessageTemRight message={message} key={message.id} />
            }
            else {
              if (receiverUser) {
                if (messages.length === index + 1) {
                  if (scrollRefMounted.current) scrollRefMounted.current = false
                  else scrollRefMounted.current = true
                  return <div ref={scrollRef} >
                    <MessageTem message={message} receiverUser={receiverUser} key={message.id} />
                    {/* <div ref={scrollRef} className='bg-red-100'>
                      <h1 className='text-9xl text-transparent '>Sifat Chat</h1>
                    </div> */}
                  </div>
                }
                else return <MessageTem message={message} receiverUser={receiverUser} key={message.id} />
              }

            }
          })
        }

        {
           isNewChat && receiverUser?.name? (
            <div className='text-gray-400 font-semibold'>
              {`Say hi 👋 to ${getFirstWord(receiverUser?.name)}`}
            </div>
           ) : ''
        }




      </div>

      <div className='absolute bottom-0 sm:bottom-1 flex justify-between border-solid border-green-500 border-2 w-[99vw] bg-gray-100 rounded-full py-1'>
        <input onKeyDown={(e) => {
          if (e.code === 'Enter') {
            setInputmessage(InputmessageTmp); setInputmessageTmp({ text: '', img: '' }); InputmessageRef.current?.focus();
          }
        }} ref={InputmessageRef} value={InputmessageTmp?.text} onChange={(e) => setInputmessageTmp({ text: (e.target as HTMLInputElement).value, img: '' })} className='w-[90%] h-9 bg-gray-100 outline-none rounded-full' type="text" />
        <button onClick={() => { setInputmessage(InputmessageTmp); setInputmessageTmp({ text: '', img: '' }); InputmessageRef.current?.focus(); }} className=''><SendIcon /></button>
      </div>
    </div>
  )
}

export default ChatInterFace