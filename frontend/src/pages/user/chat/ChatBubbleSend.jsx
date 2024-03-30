// ChatBubble.jsx
import React from 'react';

const ChatBubbleSend = ({message,first ,path}) => {
  const handleDownload = (filePath) => {
    // Create a temporary anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href = filePath;
    downloadLink.setAttribute('download', ''); // Add the 'download' attribute to force download
    downloadLink.style.display = 'none'; // Hide the link
    document.body.appendChild(downloadLink);

    // Trigger the click event
    downloadLink.click();

    // Clean up
    document.body.removeChild(downloadLink);
};
  return (
   <div className=' justify-end flex' onClick={() => path && handleDownload(path)}>
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
