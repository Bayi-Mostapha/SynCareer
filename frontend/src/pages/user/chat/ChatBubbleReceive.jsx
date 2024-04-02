import React from 'react'

export default function ChatBubbleReceive({profileImageUrl,sender,message,first,path,time}) {
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
   <>
    <div className={`w-2/3 flex  md:ml-5 ${first ? 'mt-5' : 'mt-1 '}  `} onClick={() => path && downloadResume(filename)}>
          <div className="  flex items-start justify-start">
            <div className="w-10 h-10 overflow-hidden rounded-full ">
            
                {first && <img className="object-cover w-full h-full" src={profileImageUrl} alt="profile" />  
                 }
            </div>
          </div>
          <div className=" basis-5/6 flex flex-col justify-start pt-1 px-3 ">
          {first && <p className="text-gray-900 text-md font-semibold mb-2">{sender}</p>
                 }
            
            <div className="bg-gray-50 w-full  rounded-md p-3 px-5 relative pb-6">
              <p className="text-sm text-gray-700 ">{path ? filename : message}</p>
              <p className='absolute bottom-2 right-3 text-gray-800 text-xs font-medium z-40'>{time}</p>
            </div>
          </div>
        
    </div>
   </>
  )
}
