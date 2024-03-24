// ChatBubble.jsx
import React from 'react';

const ChatBubbleSend = ({message,first }) => {
  return (
   <div className=' justify-end flex'>
    <div className={`placeholder: w-2/3 flex  justify-end ${first ? 'mt-3' : 'mt-1' }`}>
      <div className=" basis-5/6 flex flex-col justify-start pt-1 px-3">
        {first && <p className="text-gray-900 text-md font-bold mb-2">you</p> }
      <div className="bg-gray-100 w-full  rounded rounded-tl-none p-3 px-5">
        <p className="text-sm text-gray-700 font-medium">{message}</p>
      </div>
      </div>
    </div>
    </div>
  );
};

export default ChatBubbleSend;
