// ChatMessage.jsx
import React from 'react';

const ChatContact = ({ profileImageUrl, sender, timestamp, message, unreadCount,conversation_id,onClickContact , userId ,selected}) => {


  return (
   
    <div  onClick={() => onClickContact(conversation_id,profileImageUrl,sender,"google",userId)} className={`flex items-start justify-between ${selected == conversation_id ? 'bg-blue-100' : 'bg-gray-100'} py-3 px-8 cursor-pointer`}>
      
      <div className="w-10 h-10  rounded-full relative flex items-center justify-center">
        <img className="rounded-full object-cover w-full h-full" src={profileImageUrl} alt="profile" />
        <div className='w-3 h-3 rounded-full bg-green-600 top-1 z-30 absolute -right-1'></div>
      </div>
      <div className="flex flex-col basis-5/6">
        <div className="flex justify-between items-center w-full pb-2">
          <p className={`text-black font-medium text-md`}>{sender}</p>
          {unreadCount > 0 && (
            <div className="w-5 h-5 rounded-full bg-blue-600 flex justify-center items-center">
              <p className="text-sm text-white font-medium">{unreadCount}</p>
            </div>
          )}
          {unreadCount <= 0 && (
            <p className="text-xs text-tline font-small ">{timestamp}</p>
          )}
        </div>
        <div className="h-5 ">
          <p className="text-gray-500 text-xs font-small h-full overflow-hidden leading-5 ">
            {message ? message :  'no messages yet'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatContact;
