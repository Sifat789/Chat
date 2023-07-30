import React from 'react';
import { messagesType } from '../Pages/ChatInterFace';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/ReduxStore';

interface MessageTemType {
   message: messagesType
}

const MessageTemRight: React.FC<MessageTemType> = ({message}) => {

    const currentUser = useSelector((state:RootState)  => state.CurUserSlice)


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
    return (
        <div className='flex flex-col'>
            <span className='self-center'>{formatDateToLocal(message.date)}</span>
            <div className='flex justify-end'>
                <h1 className='w-[88%] bg-blue-500 text-white p-2 rounded-md mr-2'>{message.message? message.message: message.img}</h1>
                <div className='flex self-end space-x-2 items-center mt-1'>
                    <span className='h-10 w-10 rounded-full flex justify-center items-center bg-blue-500 self-end'>{currentUser.name[0]}</span>
                </div>
            </div>
        </div>
    );
};

export default MessageTemRight;
