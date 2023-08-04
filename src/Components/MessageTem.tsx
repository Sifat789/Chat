import React, { useEffect } from 'react';
import { messagesType } from '../Pages/ChatInterFace';
import { receiverUserType } from '../Pages/ChatInterFace';

interface MessageTemType {
   message: messagesType
   receiverUser: receiverUserType
}

const MessageTem: React.FC<MessageTemType> = ({message, receiverUser}) => {

  function formatDateToLocal(timestamp:any) {
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
  

  useEffect(() => {
    
  })

  return (
    <div className='flex flex-col'>
      <span className='self-center mb-2'>{formatDateToLocal(message.date)}</span>
      <div className='flex space-x-2 items-center w-[100%] mt-1'>
        <span className='h-10 w-10 ml-2 rounded-full flex justify-center items-center bg-blue-500 self-end'>{receiverUser.name? receiverUser.name[0] : ''}</span>
        <h1 className=' max-w-[70vw] bg-gray-100 p-2 rounded-md'>{message.message? message.message: message.img}</h1>
      </div>
    </div>
  );
};

export default MessageTem;
