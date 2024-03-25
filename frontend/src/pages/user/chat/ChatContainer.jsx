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
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area"


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
    // const userId = 1;
    // const profileImageUrl = ``;
    const icon1 = `http://localhost:8000/images/other/user.png`;


    const [conversations, setConversations] = useState();

    const [actualConversationId, setActualConversationId] = useState();
    const [previousActualConversationId, setPreviousActualConversationId] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState("http://localhost:8000/images/default.jpg");
    const [username, setUsername] = useState("unkown");
    const [jobTitle, setJobTitle] = useState("unkown");
    const [userId, setUserId] = useState(1);

    const [messages, setMessages] = useState();

    const [isLast, setIsLast] = useState(0);

    const userContext = useContext(authContext);
  

    const MessageInput = useRef(); 
    const lastMessageRef = useRef(null);

    // const sendUsersOnline = async (users) => {
    //     try {
    //         const { data } = await axiosClient.post('/onlineUsers',{
    //             users : users  
    //         });
          
    //     } catch (error) {
    //         console.log('Error fetching conversations:', error);
    //     }
        
    // };
    const [onlineUsers, setOnlineUsers] = useState([]);
    useEffect(() => {
        const channel = window.Echo.join(`online`);

        channel.here((users) => {
            console.log('Users currently in the channel:', users);
            const filteredUserIds = users.filter(user => user.role === 'company').map(user => user.id);
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
        // Return a cleanup function to leave the channel when the component unmounts
        return () => {
            
        };
    }, []);
    
    
        
    
    useEffect(() => {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages]);

    const fetchData = async () => {
        try {
            const { data } = await axiosClient.post('/fetchConversations');
            setConversations(data);
            console.log(data);
        } catch (error) {
            console.log('Error fetching conversations:', error);
        }
        
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log('bro id is  ', actualConversationId);
        if (actualConversationId !== null) {
            setPreviousActualConversationId(actualConversationId);
        }
        window.Echo.leave('private.user.' + previousActualConversationId);

    window.Echo.private('private.user.' + actualConversationId).listen('.chatUser', (e) => {
        // fetchMessage();
        console.log('hey from user '+actualConversationId);
        if(actualConversationId == e.conversationId ){
            setMessages(prevMessages => [
                ...(prevMessages || []),
                {
                    id: e.message, 
                    content: e.message,
                    sender_id: userContext.user.id , 
                    sender_type: e.sender_type,
                    first_group: e.first_group
                }
            ]);
        }
    });
    window.Echo.private('private.chat.' + userContext.user.id).listen('.chat', (e) => {
        console.log('brother');
        // fetchData();
        if(actualConversationId == e.conversationId){
            updateMessageStatus();
            fetchData();
        }
       
    });
    window.Echo.private('onlineData').listen('.onlinee', (e) => {
        console.log(e.users);
    });
    
    fetchMessage();
    fetchData();
    return () => {
        window.Echo.leave('private.user.' + actualConversationId);
    };
  }, [actualConversationId])

  
  const handleClick = async () => {
      try {
        const msg = MessageInput.current.value ;
        MessageInput.current.value = "" ;
        setMessages([...messages, {
            id: msg, 
            content: msg,
            userId: userId ,
            sender_id : userContext.user.id , 
            sender_type : userContext.user.type
        }]);
        await axiosClient.post('/sendMessage', {
            message: msg ,
            conversationId : actualConversationId , 
            userId : userId ,
            userType : userContext.user.type
        });
      } catch (error) {
          console.log(error);
      } 
  };

  const fetchMessage = async () => {
    try {
        setMessages(null);
        // updateMessageStatus();
        const { data } = await axiosClient.post('/fetchMessages',{
            conversation_id : actualConversationId
        });
        setMessages(data.messages);
        setIsLast(data.isLast);
    } catch (error) {
        console.log('Error fetching conversations:', error);
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

const handleClickContact = (convId, profilePic, sender, jobTitle, id) => {
       
       if(actualConversationId != convId){
        setPreviousActualConversationId(actualConversationId);
        // setMessages(null);
        console.log(isLast);
        setActualConversationId(convId);
        setProfileImageUrl(profilePic);
        setUsername(sender);
        setJobTitle(jobTitle);
        setUserId(id);
        setConversations(prevConversations => 
            prevConversations.map(conversation => ({
                ...conversation,
                selected: conversation.conversation_id == convId ,
                unread_messages_count: conversation.conversation_id == convId ? 0 : conversation.unread_messages_count
            }))
        );
       }
    
        console.log('hey from click ',+ actualConversationId);
    
};
    
     
    
  
    
    return (
      <>
      <div className="flex flex-col h-screen bg-background">
        {/* hidden contact sidebar for responsive  */}
        <ContactSideBar ImageUrl={icon1}  profileImageUrl={profileImageUrl} UnreadMsgNumber={200} />
        {/* contact side bar */}
        <div className="hidden lg:flex flex-col absolute top-20 bottom-0 left-0 w-96 z-20 bg-gray-100 ">
          <div className="justify-start flex flex-col px-8 pt-6"> 
            <p className="font-medium text-2xl text-black mb-1">Messages</p>
            <p className="text-sm  text-unread mb-1">4 Unread</p>
          </div>
          <div class="relative px-9 mb-7 mt-3">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  {/* <svg class="w-5 h-5 ml-9 text-gray-300 dark:text-gray-300" ariaHidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg> */}
              </div>
              <input type="text"  class="block w-full p-3  ps-10 text-sm placeholder:text-gray300 text-gray-800 border-none  rounded-lg bg-white outline-none   " placeholder="Search "  />
          </div>
          {/* display contacts  */}

          <ScrollArea className=" h-full">
          {conversations && conversations.map(conversation => (
                        <ChatContact 
                            key={conversation.conversation_id} 
                            profileImageUrl={conversation.profile_pic ? conversation.profile_pic : `http://localhost:8000/images/default.jpg`}
                            sender={conversation.sender_name}
                            timestamp={conversation.last_message_time}
                            message={conversation.last_message_content}
                            unreadCount={conversation.unread_messages_count}
                            onClickContact={handleClickContact}
                            conversation_id={conversation.conversation_id}
                            userId={conversation.user2_id}
                            selected={conversation.selected}
                            online={onlineUsers.includes(conversation.user2_id)}
                        />
                    ))}
            
          </ScrollArea>
        </div>

     
           {/* User profile navbar */}

        <ChatNav ImageUrl={profileImageUrl} Name={username} JobTitle={jobTitle}/>
  
        {/* Chat messages area */}
        
    <ScrollArea   className="bg-background flex-grow overflow-x-hidden overflow-y-auto px-2 pt-20 mb-2 lg:ml-96">
    {messages && messages.map((message ,index)=> (
    message.sender_id === userContext.user.id && 
    message.sender_type === userContext.user.type ? (
        <ChatBubbleSend
            key={index}
            message={message.content}
            first={message.first_group}
             
        />
    ) : (
        <ChatBubbleReceive
        key={index}
        message={message.content}
        first={message.first_group}
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
            ref={MessageInput}
            id="large-input"
            placeholder="Type your message here..."
            className="h-full outline-none block w-full p-2 text-gray-700 border-none rounded-lg text-base resize-none ml-3"
            ></textarea>
           </ScrollArea>
        </div>
        <div className="flex  justify-center items-end basis-1/6">
            <button
            className="w-9 mr-2 cursor-pointer"
            ><img className="w-full " src="http://localhost:8000/images/fileup.png" alt="" /></button>
            <button
            onClick={handleClick}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-6 py-2.5"
            >
            Send
            </button>
        </div>
    </div>
    </div>
        


 </div>
      </>
      
    )
  }
