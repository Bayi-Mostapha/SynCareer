// ChatBubble.jsx
import { axiosClient } from '@/api/axios';
import React from 'react';

const ChatBubbleSend = ({message,first ,path}) => {
  const requestFile = async (filePath) => {
    const response = await axiosClient.get(`/downloadFile/${filePath}`, {
      responseType: 'blob', // Set the response type to blob
  });
  }
  const downloadFile = async (filePath) => {
    try {
      requestFile(filePath);

        // Create a blob URL from the response data
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

        // Create a temporary anchor element
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.setAttribute('download', filePath.split('/').pop()); // Extract the file name from the file path
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);

        // Trigger the click event
        downloadLink.click();

        // Clean up
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(downloadLink);
    } catch (error) {
        console.error('Error downloading file:', error);
        if (error.response) {
          console.error('Error response:', error.response);
      }
    }
};

  return (
   <div className=' justify-end flex' onClick={() => path && downloadFile(path)}>
    <div className={`placeholder: w-2/3 flex  justify-end ${first ? 'mt-3' : 'mt-1' }`}>
      <div className=" basis-5/6 flex flex-col justify-start pt-1 px-3">
        {first && <p className="text-gray-900 text-md font-bold mb-2">you</p> }
      <div className="bg-gray-100 w-full  rounded rounded-tl-none p-3 px-5">
        <p className="text-sm text-gray-700 font-medium">{path ? path : message}</p>
      </div>
      </div>
    </div>
    </div>
  );
};

export default ChatBubbleSend;
