import React from 'react'
import { useState, useEffect  } from 'react';

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { CiChat1 } from "react-icons/ci";
import ChatContact from './ChatContact';
import { ScrollArea } from "@/components/ui/scroll-area"


export default function ContactSideBar({ profileImageUrl, UnreadMsgNumber,data,onClickContact,actualConversationId,onlineUsers}) {
    const [searchValue, setSearchValue] = useState('');
    const [filteredContacts, setFilteredContacts] = useState(false);
    
    // Filter contacts based on search value
    useEffect(()=>{
        if(searchValue == ''){
            setFilteredContacts(false);
        }
        const Contacts = data?.filter(contact => {
            return contact.name.toLowerCase().includes(searchValue.toLowerCase());
        });
        setFilteredContacts(Contacts);
    },[searchValue]);
    
    // Handle input change
    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };
    return (
        <Sheet >
            <SheetTrigger>
                <div className=" bg-primary w-12 h-12 overflow-hidden p-2 rounded-full mx-4 absolute right-2 bottom-28 cursor-pointer  lg:hidden z-50">
                    <CiChat1 className="object-cover w-full h-full text-white" />
                </div>
            </SheetTrigger>
            <SheetContent className=" flex flex-col bg-gray-100 p-0">
                <div className="justify-start flex flex-col px-8 pt-6">
                    <p className="font-medium text-2xl text-black mb-1">Messages</p>
                    <p className="text-sm  text-unread mb-1">{UnreadMsgNumber > 99 ? '+99' : UnreadMsgNumber} Unread</p>
                </div>
                <div className="relative px-5">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-5 h-5 ml-5 text-gray-300 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="text" className="block w-full p-3  ps-10 text-sm placeholder:text-gray300 text-gray-800 border-none  rounded-lg bg-white outline-none   " placeholder="Search " onChange={handleInputChange}/>
                </div>
                <ScrollArea  className="w-full h-full mt-5 p-0 overflow-y-scroll ">
    
                {filteredContacts && filteredContacts.length > 0 && 
                        filteredContacts.map(conversation => (
                            <ChatContact 
                                key={conversation.conversation_id} 
                                profileImageUrl={conversation.profile_pic ? conversation.profile_pic : `http://localhost:8000/images/default.png`}
                                sender={conversation.name}
                                timestamp={conversation.last_message_time}
                                message={conversation.last_message}
                                unreadCount={conversation.unread_messages_count}
                                onClickContact={onClickContact}
                                conversation_id={conversation.conversation_id}
                                userId={conversation.user_id}
                                jobTitle={conversation.job_title}
                                selected={actualConversationId}
                                online={onlineUsers.includes(conversation.user_id)}
                                isLast={conversation.actual_user_last_sender}
                            />
                        ))
                   }

                    {!filteredContacts && data && data.length > 0 && (
                        data.map(conversation => (
                            <ChatContact 
                                key={conversation.conversation_id} 
                                profileImageUrl={conversation.profile_pic ? conversation.profile_pic : `http://localhost:8000/images/default.png`}
                                sender={conversation.name}
                                timestamp={conversation.last_message_time}
                                message={conversation.last_message}
                                unreadCount={conversation.unread_messages_count}
                                onClickContact={onClickContact}
                                conversation_id={conversation.conversation_id}
                                userId={conversation.user_id}
                                jobTitle={conversation.job_title}
                                selected={actualConversationId}
                                online={onlineUsers.includes(conversation.user_id)}
                                isLast={conversation.actual_user_last_sender}
                            />
                        ))
                    )}
                    {/* <div className="flex items-start justify-between bg-gray-100 py-3 px-8  ">
                        <div className="w-10 h-10 overflow-hidden rounded-full ">
                            <img className="object-cover w-full h-full" src={profileImageUrl} alt="profile" />
                        </div>
                        <div className="flex flex-col basis-5/6">
                            <div className="flex justify-between items-center w-full pb-2">
                                <p className="text-black font-medium text-md">mostafa bayi</p>
                                <p className="text-xs text-tline font-small">5 min</p>
                            </div>
                            <div className="h-5">
                                <p className="text-gray-500 text-xs font-small h-full overflow-hidden">
                                    hey sir hey sir hey sir
                                </p>
                            </div>
                        </div>
                    </div> */}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
