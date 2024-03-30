import React from 'react'

export default function ChatBubbleReceive({profileImageUrl,sender,message,first,path}) {
  const handleDownload = (filePath) => {
    console.log('File path:', filePath);

    // Create a temporary anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href = filePath;
    downloadLink.setAttribute('download', ''); // Add the 'download' attribute to force download
    downloadLink.style.display = 'none'; // Hide the link
    document.body.appendChild(downloadLink);

    // Trigger the click event
    downloadLink.click();

    
    document.body.removeChild(downloadLink);
};
  return (
   <>
    <div className={`w-2/3 flex  md:ml-5 ${first ? 'mt-5' : 'mt-1 '}`} onClick={() => path && handleDownload(path)}>
          <div className="  flex items-start justify-start">
            <div className="w-10 h-10 overflow-hidden rounded-full ">
            
                {first && <img className="object-cover w-full h-full" src={profileImageUrl} alt="profile" />  
                 }
            </div>
          </div>
          <div className=" basis-5/6 flex flex-col justify-start pt-1 px-3 ">
          {first && <p className="text-gray-900 text-md font-bold mb-2">{sender}</p>
                 }
            
            <div className="bg-blue-50 w-full  rounded p-3 px-5">
              <p className="text-sm text-gray-700 font-medium">{message ? message : path}</p>
            </div>
          </div>
    </div>
   </>
  )
}
