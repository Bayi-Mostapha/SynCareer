import React from 'react'

export default function ChatNav({ImageUrl,Name,JobTitle}) {
  return (
    <div className="flex justify-start items-center py-4 shadow-sm cursor-pointer z-10 sticky top-16 lg:ml-96 border-gray-500 border-1 bg-background">
          <div className="w-12 h-12 overflow-hidden rounded-full mx-4 ">
            <img className="object-cover w-full h-full" src={ImageUrl} alt="profile" />
          </div>
          <div className="">
            <p className="text-black text-md font-semibold ">{Name}</p>
            <p className="text-gray-500 text-sm font-medium">{JobTitle}</p>
          </div>
    </div>
  )
}
