// ChatBubble.jsx
import { axiosClient } from '@/api/axios';
import React from 'react';

const ChatBubbleSend = ({message,first ,path,time}) => {
  const filename = path?.split('/').pop();
  const downloadResume = async (filename) => {
    try {
        const response = await axiosClient.get(`/downloadFile/${filename}`, {
            responseType: 'blob', 
           
        });
        console.log('file:', response.data);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        // Revoke the object URL to release memory
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading resume:', error);
        toast.error('Error downloading resume');
    }
};



  return (
   <div className=' justify-end flex' onClick={() => path && downloadResume(filename)}>
    <div className={`placeholder: w-2/3 flex  justify-end ${first ? 'mt-3' : 'mt-1' }`}>
      <div className=" basis-5/6 flex flex-col justify-start pt-1 px-3">
        {first && <p className="text-gray-900 text-md mb-2 font-semibold">you</p> }
      <div className="bg-blue-100 w-full  rounded-md p-3 px-5 relative pb-6 ">
        <p className="text-sm text-black ">{path ? filename : message}</p>
        <p className='absolute bottom-2 right-3 text-gray-800 text-xs font-medium z-40'>{time}</p>
      </div>
      </div>
    </div>
    </div>
  );
};

export default ChatBubbleSend;
