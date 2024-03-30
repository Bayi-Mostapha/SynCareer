import React from 'react';
import ChatNav from './ChatNav';
import ContactSideBar from './ContactSideBar';
import ChatContact from './ChatContact';
import ChatBubbleSend from './ChatBubbleSend';
import ChatBubbleReceive from './ChatBubbleReceive';
import { useState, useEffect ,useRef } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { axiosClient } from '@/api/axios';
import { useContext } from 'react';
import { authContext } from '@/contexts/AuthWrapper';
import { ScrollArea } from "@/components/ui/scroll-area"
import { FaFileCirclePlus } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";


window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'local',
  wsHost: 'localhost',
  wsPort: 6001,
  cluster: "mt1",
  forceTLS: false,
  disableStats: true,
  authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
  auth: {
      headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
      }
  },
});

export default function ChatContainer() {
    const icon1 = `http://localhost:8000/images/other/user.png`;
    const [conversations, setConversations] = useState();
    const [actualConversationId, setActualConversationId] = useState(0);
    const [previousActualConversationId, setPreviousActualConversationId] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState("http://localhost:8000/images/default.jpg");
    const [username, setUsername] = useState("unkown");
    const [jobTitle, setJobTitle] = useState("unkown");
    const [userId, setUserId] = useState(1);
    const [messages, setMessages] = useState(true);
    const [isLast, setIsLast] = useState(false);
    const userContext = useContext(authContext);
    const MessageInput = useRef(); 
    const lastMessageRef = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [data, setData] = useState();
    
    useEffect(() => {
        if(actualConversationId !== 0){
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages,data,isLast]);

    useEffect(() => {
        if(actualConversationId !== 0){
            const conversationToUpdate = data.find(conversation => conversation.conversation_id === actualConversationId);
            if (conversationToUpdate) {
                const messagesToUpdate = conversationToUpdate.messages;
                setMessages(messagesToUpdate);
                console.log("msgs",messagesToUpdate);
            } else {
                console.error("Conversation not found.");
            }
         }
    }, [data]);
    const [totalUnreadMessagesCount,setTotalUnreadMessagesCount] = useState(0);
    const fetchDataGlobale = async () => {
        try {
            const { data } = await axiosClient.get('/conversations');
            console.log('yeeees',data);
            setData(data)
            const UnreadMessagesCount = data.reduce((total, conversation) => {
                return total + conversation.unread_messages_count;
            }, 0);
            setTotalUnreadMessagesCount(UnreadMessagesCount);
        } catch (error) {
            console.log('Error fetching conversations:', error);
        }
    };

    useEffect(() => {
        fetchDataGlobale(); 
        const channel = window.Echo.join(`online`);
        channel.here((users) => {
            console.log('Users currently in the channel:', users);
            const filteredUserIds = users.filter(user => user.role === 'user').map(user => user.id);
            setOnlineUsers(filteredUserIds);
        }).joining((user) => {
            console.log('User joining:', user);
            if (user.role === 'user') {
                setOnlineUsers(prevUserIds => [...prevUserIds, user.id]);
            }
        }).leaving((user) => {
            console.log('User leaving:', user);
            if (user.role === 'user') {
                setOnlineUsers(prevUserIds => prevUserIds.filter(id => id !== user.id));
            }
        });
    }, []);
  
    useEffect(() => {
       if (actualConversationId !== null) {
            setPreviousActualConversationId(actualConversationId);
        }
        window.Echo.leave('private.company.' + previousActualConversationId);

        window.Echo.private('private.company.' + actualConversationId).listen('.chatUser', (e) => {
            // if(actualConversationId !== 0){
            //     const conversationToUpdate = data.find(conversation => conversation.conversation_id === actualConversationId);
            //     if (conversationToUpdate) {
            //         const messagesToUpdate = conversationToUpdate.messages;
            //         setMessages(messagesToUpdate);
            //         console.log("msgs",messagesToUpdate);
            //     } else {
            //         console.error("Conversation not found.");
            //     }
            //     updateMessageStatus();
            // }
             updateMessageStatus();

            fetchDataGlobale();
            setIsLast(false);
        });

    // this channel is message notifications 
    window.Echo.private('private.chat.' + userContext.user.id).listen('.chat', (e) => {
        console.log('you received a message ');
        if(e.conversation_id != actualConversationId){
            fetchDataGlobale();
        }
    });
    // // this is for online users 
    // window.Echo.private('onlineData').listen('.onlinee', (e) => {
    //     console.log(e.users);
    // });

    return () => {
        if (previousActualConversationId) {
            window.Echo.leave(`private.company.${previousActualConversationId}`);
        }
    };
  }, [actualConversationId,previousActualConversationId])

  const handleClick = async () => {
      try {
        const msg = MessageInput.current.value ;
        MessageInput.current.value = "" ;
      
        await axiosClient.post('/sendMessage', {
            message: msg ,
            conversationId : actualConversationId , 
            userId : userId ,
            userType : userContext.user.type
        });

        const newMessage = {
            message_id: msg ,
            content: msg,
            sender_role: userContext.user.type,
            message_type: "text",
            message_status: "sent",
            is_first_message: isLast ? false : true
        };
        if (Array.isArray(data)) {
            const conversationToUpdateIndex = data.findIndex(conversation => conversation.conversation_id === actualConversationId);
        
            if (conversationToUpdateIndex !== -1) {
                // Clone the data array to avoid mutating the state directly
                const updatedData = [...data];
        
                // Clone the conversation object to avoid mutating the state directly
                const updatedConversation = { ...updatedData[conversationToUpdateIndex] };
        
                // Push the new message into the messages array of the conversation
                updatedConversation.messages.push(newMessage);
        
                // Update the conversation within the updatedData array
                updatedData[conversationToUpdateIndex] = updatedConversation;
        
                // Update the state with the updated data for the specific conversation
                setData(updatedData);
                console.log(updatedData);
            } else {
                console.error("Conversation not found.");
            }
        } else {
            console.error("Data is not an array or is undefined.");
        }
        
        setIsLast(true);

        
      } catch (error) {
          console.log(error);
      } 
  };
  
const updateMessageStatus = async () => {
    try {
        const { data } = await axiosClient.post('/updateMessageStatus',{
            conversation_id : actualConversationId ,
        });
    } catch (error) {
        console.log('Error : update Message Status', error);
    }
};

const handleClickContact = (convId, profilePic, sender, jobTitle, id,flag) => {
    if(actualConversationId != convId){
        setMessages(null);
        setIsLast(flag)
        console.log(isLast);
        setActualConversationId(convId);
        setProfileImageUrl(profilePic);
        setUsername(sender);
        setJobTitle(jobTitle);
        setUserId(id);
        const updatedConversations = data.map(conversation => {
            if (conversation.conversation_id === convId) {
                return {
                    ...conversation,
                    unread_messages_count: 0
                };
            }
            return conversation;
        });
        setData(updatedConversations);
        console.log(updatedConversations);
    }
    updateMessageStatus();
    fetchDataGlobale();
};
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





    const [file, setFile] = useState(null);
    const [fileFlag, setFileFlag] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        MessageInput.current.value = e.target.files[0].name  ;
        setFileFlag(!fileFlag);
    };
    const fileCancel = () => {
        setFileFlag(!fileFlag);
        setFile(null);
        MessageInput.current.value = ""  ;
    }
    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('conversationId', actualConversationId);
            formData.append('userId', userId);
            formData.append('userType', userContext.user.type);
            const response = await axiosClient.post('/sendMessageFile', formData , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });

            console.log('File uploaded:', response.data);
            // Handle success (e.g., show a success message)
        } catch (error) {
            console.error('Error uploading file:', error);
            // Handle error (e.g., show an error message)
        }
    };
    return (
      <div className="relative">
      <div className="flex flex-col h-screen bg-background ml-16">
        {/* hidden contact sidebar for responsive  */}
        <ContactSideBar ImageUrl={icon1}  profileImageUrl={profileImageUrl} UnreadMsgNumber={200} />
        {/* contact side bar */}
        <div className="hidden lg:flex flex-col absolute top-16 bottom-0 left-16 w-96 z-20 bg-gray-100 ">
          <div className="justify-start flex flex-col px-8 pt-6"> 
            <p className="font-medium text-2xl text-black mb-1">Messages</p>
            <p className="text-sm  text-unread mb-1">{totalUnreadMessagesCount} Unread</p>
          </div>
          <div className="relative px-9 mb-7 mt-3">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
                    <svg className="w-5 h-5 ml-9 text-gray-300 dark:text-gray-300 " ariaHidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input 
                    type="text"  
                    className="block w-full p-3  ps-10 text-sm placeholder:text-gray300 text-gray-800 border-none  rounded-lg bg-white outline-none" 
                    placeholder="Search" 
                    value={searchValue}
                    onChange={handleInputChange}
                />
          </div>
          {/* display contacts  */}
          <ScrollArea className=" h-full">
           
                {filteredContacts && filteredContacts.map(conversation => (
                    <ChatContact 
                        key={conversation.conversation_id} 
                        profileImageUrl={conversation.profile_pic ? conversation.profile_pic : `http://localhost:8000/images/default.jpg`}
                        sender={conversation.name}
                        timestamp={conversation.last_message_time}
                        message={conversation.last_message}
                        unreadCount={conversation.unread_messages_count}
                        onClickContact={handleClickContact}
                        conversation_id={conversation.conversation_id}
                        userId={conversation.user_id}
                        jobTitle={conversation.job_title}
                        selected={actualConversationId}
                        online={onlineUsers.includes(conversation.user_id)}
                        isLast={conversation.actual_user_last_sender}
                    />
                ))}
                
                {!filteredContacts && data && data.map(conversation => (
                    <ChatContact 
                        key={conversation.conversation_id} 
                        profileImageUrl={conversation.profile_pic ? conversation.profile_pic : `http://localhost:8000/images/default.jpg`}
                        sender={conversation.name}
                        timestamp={conversation.last_message_time}
                        message={conversation.last_message}
                        unreadCount={conversation.unread_messages_count}
                        onClickContact={handleClickContact}
                        conversation_id={conversation.conversation_id}
                        userId={conversation.user_id}
                        jobTitle={conversation.job_title}
                        selected={actualConversationId}
                        online={onlineUsers.includes(conversation.user_id)}
                        isLast={conversation.actual_user_last_sender}
                    />
                ))}
            
        
          </ScrollArea>
        </div>

        {actualConversationId !== 0 ? 
        <>
         {/* User profile navbar */}
        <ChatNav ImageUrl={profileImageUrl} Name={username} JobTitle={jobTitle}/>
        {/* Chat messages area */}
        <ScrollArea   className="bg-background flex-grow overflow-x-hidden overflow-y-auto px-2 pt-20 mb-2 lg:ml-96">
            {messages && messages.map((message ,index)=> (
            message.sender_role === userContext.user.type ? (
            <ChatBubbleSend
                key={message.content}
                message={message.content}
                first={message.is_first_message}
            />
            ) : (
            <ChatBubbleReceive
                key={message.content}
                message={message.content}
                first={message.is_first_message}
                profileImageUrl={profileImageUrl}
                sender={username}
            />
            )
        ))}
        <div ref={lastMessageRef} className=' w-full h-3 b-background'></div>
        </ScrollArea>
        {/* Input area */}
        <div className="lg:pl-5 bg-background">
            <div className="mb-6 p-2  border border-gray-300 rounded-xl h-20 mx-5 flex flex-row justify-between items-end pt-3 lg:ml-96">
                <div className="basis-3/5 lg:basis-5/6 ">
                    <ScrollArea>
                        <textarea
                         disabled={fileFlag ? true : false}
                        ref={MessageInput}
                        id="large-input"
                        placeholder="Type your message here..."
                        className={` h-full outline-none block w-full p-2 text-gray-700 border-none rounded-lg text-base resize-none ml-3`}
                        ></textarea>
                    </ScrollArea>
                </div>
                <div className="flex  justify-center items-end basis-1/6">
                { fileFlag
                    ? 
                    <MdCancel className="mr-2 cursor-pointer" size={35}  onClick={fileCancel}/> 
                    : 
                    <label htmlFor="file">
                    <FaFileCirclePlus className="mr-2 cursor-pointer" size={35} />
                </label>
                }
                
                <input type="file" onChange={handleFileChange} hidden id='file' />
                <button
                    onClick={fileFlag ? handleUpload : handleClick}
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-6 py-2.5"
                    >
                    Send
                </button>
                </div>
            </div>
        </div>
    </>
        :  ''
    }
 </div>
 </div>
    )
  }
