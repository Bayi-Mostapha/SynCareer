import React from 'react'

export default function ChatNav({ImageUrl,Name,JobTitle}) {
  return (
    <div className="flex justify-start items-center py-4 shadow-sm cursor-pointer z-10 sticky top-16 lg:ml-96 border-gray-500 border-1 bg-white">
          <div className="w-14 h-14 overflow-hidden rounded-full mx-4">
            <img className="object-cover w-full h-full" src={ImageUrl} alt="profile" />
          </div>
          <div className="">
            <p classNam e="text-black text-lg font-medium">{Name}</p>
            <p className="text-gray-500 text-sm font-medium">{JobTitle}</p>
          </div>
    </div>
  )
}
