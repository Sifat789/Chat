import React from 'react';
import { messagesType } from '../Pages/ChatInterFace';

interface MessageTemType {
   message: messagesType
}

const MessageTemRight: React.FC<MessageTemType> = ({message}) => {



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

    // const handleWidthLength = (length:number) => {
    //     return Math.min(length,25)
    // }
    return (
        <div className='flex flex-col'>
            <span className='self-center mb-2'>{formatDateToLocal(message.date)}</span>
            <div className='flex justify-end'>
                <h1  className=' max-w-[70vw] bg-blue-500 text-white p-2 rounded-md mr-2'>{message.message? message.message: message.img}</h1>
            </div>
        </div>
    );
};

export default MessageTemRight;
