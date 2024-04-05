import { useContext, useEffect, useRef, useState } from "react";
import { axiosClient } from "@/api/axios";
import { authContext } from "@/contexts/AuthWrapper";
import Echo from 'laravel-echo';
// shadcn 
import { IoIosMenu } from "react-icons/io";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import { USER_HOME_LINK, USER_RESUMES_LINK, USER_CHAT_LINK, USER_PASSQUIZ_LINK, USER_CALENDAR_LINK, USER_CALL, UPCOMMING_INTERVIEWS } from "@/router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "../ui/scroll-area";
// icons 
import { IoIosNotificationsOutline } from "react-icons/io";
// functions 
import formatDistanceToNow from "@/functions/format-time";
import ProfileNavigator from "../general/profile-navigator";
// sound 

function TopNav() {
    const audioRef = useRef(null);
    const navigate = useNavigate()

    const { user } = useContext(authContext);
    const [open, setOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [newNotification, setNewNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const playNotificationSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    useEffect(() => {
        getNotifications()
        setupPusher()

        const breakpoint = 1024
        if (window.innerWidth > breakpoint) {
            setOpen(false);
        } else {
            setOpen(true);
        }
        const handleResize = () => {
            if (window.innerWidth > breakpoint) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])
    useEffect(() => {
        if (user.id) {
            console.log(user.id)
            window.Echo.private(`user.notifications.${user.id}`)
                .listen('.user-new-notification', (e) => {
                    playNotificationSound()
                    setNewNotification(true)
                    getNotifications()
                });
        }
    }, [user.id])
    useEffect(() => {
        if (hasUnreadNotification()) {
            setNewNotification(true)
        } else {
            setNewNotification(false)
        }
    }, [notifications])
    const setupPusher = () => {
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
    };

    async function getNotifications() {
        try {
            let res = await axiosClient.get('/user-notifications')
            setNotifications(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    function redirect(item) {
        if (item.read == '0')
            markNotificationAsRead(item.id)
        switch (item.type) {
            case 'quiz':
                navigate(`${USER_PASSQUIZ_LINK}/${item.content}`)
                break;
            case 'calendar':
                navigate(`${USER_CALENDAR_LINK}/${item.content}`)
                break;
            case 'call':
                navigate(`${USER_CALL}/${item.content}`)
                break;
        }
    }
    function displayNotifications() {
        return notifications.length > 0 ?
            notifications.map(item => {
                return (
                    <DropdownMenuItem
                        onClick={() => redirect(item)}
                        className={`my-2 flex flex-col items-start cursor-pointer rounded-sm ${item.read == 0 && 'bg-[#F4F7FE] hover:opacity-90'}`}
                        key={'notification_' + item.id}
                    >
                        <div className="flex justify-between gap-4">
                            {
                                item.type != 'call' ?
                                    <p>{item.from} send you a {item.type}</p>
                                    :
                                    <p>{item.from} is calling you</p>
                            }
                            {
                                item.read == 0 &&
                                <div className="h-[6px] w-[6px] bg-primary rounded-full"></div>
                            }
                        </div>
                        <p className="text-xs text-gray-400">{formatDistanceToNow(item.created_at)}</p>
                    </DropdownMenuItem>
                )
            })
            :
            <p className="text-sm text-gray-500">
                No notifications
            </p>
    }
    function hasUnreadNotification() {
        return notifications.some(notification => notification.read == 0);
    }
    function markAllNotificationsAsRead() {
        axiosClient.post('/user-notifications')
        setNewNotification(false)
        setNotifications(prev => prev.map(notification => {
            return { ...notification, read: "1" };
        }))
    }
    async function markNotificationAsRead(id) {
        axiosClient.post('/user-notifications/' + id)
        setNotifications(prev => prev.map(notification => {
            return notification.id === id ? { ...notification, read: "1" } : notification;
        }));
        if (hasUnreadNotification()) {
            setNewNotification(true)
        } else {
            setNewNotification(false)
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-3 lg:py-0 flex items-center bg-background shadow-sm">
            <audio ref={audioRef} src='/public/notification.wav' />
            <h1 className="py-2 text-xl text-primary font-semibold">SynCareer</h1>
            <ul className="pt-3 ml-20 hidden lg:flex gap-4">
                <li>
                    <NavLink to={USER_HOME_LINK} className={(navData) => (navData.isActive ? 'border-b-4  border-primary mt-[1px] ' : '') + 'py-4 block h-full'}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to={USER_CHAT_LINK} className={(navData) => (navData.isActive ? 'border-b-4 border-primary mt-[1px] ' : '') + 'py-4 block h-full'}>
                        Messages
                    </NavLink>
                </li>
                <li>
                    <NavLink to={UPCOMMING_INTERVIEWS} className={(navData) => (navData.isActive ? 'border-b-4 border-primary mt-[1px] ' : '') + 'py-4 block h-full'}>
                        Interviews
                    </NavLink>
                </li>
                <li>
                    <NavLink to={USER_RESUMES_LINK} className={(navData) => (navData.isActive ? 'border-b-4  border-primary mt-[1px] ' : '') + 'py-4 block h-full'}>
                        Resume Library
                    </NavLink>
                </li>
            </ul>

            {/* notifications */}
            <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
                <DropdownMenuTrigger className="relative ml-auto mr-4">
                    <IoIosNotificationsOutline className="text-2xl" />
                    {
                        newNotification &&
                        <div className="absolute top-0 right-0 h-[6px] w-[6px] bg-primary rounded-full"></div>
                    }
                </DropdownMenuTrigger>
                <DropdownMenuContent className='mr-5 p-1'>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    {
                        newNotification &&
                        <DropdownMenuItem onClick={markAllNotificationsAsRead}>
                            mark all as read
                        </DropdownMenuItem>
                    }
                    <DropdownMenuSeparator />
                    <ScrollArea className={`${notifications.length > 0 ? 'h-96 px-3' : 'py-3 px-6'}`}>
                        {displayNotifications()}
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>

            <ProfileNavigator type='ud' />
            {/* mobile nav  */}
            <Sheet>
                <SheetTrigger className="lg:hidden">
                    <IoIosMenu className="text-2xl" />
                </SheetTrigger>
                {
                    open &&
                    <SheetContent>
                        <ProfileNavigator type='um' />
                        <ul className="py-4">
                            <li>
                                <NavLink to={USER_HOME_LINK} className={(navData) => (navData.isActive ? 'bg-secondary ' : '') + 'p-2 my-4 block h-full'}>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={USER_CHAT_LINK} className={(navData) => (navData.isActive ? 'bg-secondary ' : '') + 'p-2 my-4 block h-full'}>
                                    Messages
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={UPCOMMING_INTERVIEWS} className={(navData) => (navData.isActive ? 'bg-secondary ' : '') + 'p-2 my-4 block h-full'}>
                                    Interviews
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={USER_RESUMES_LINK} className={(navData) => (navData.isActive ? 'bg-secondary ' : '') + 'p-2 my-4 block h-full'}>
                                    Resume Library
                                </NavLink>
                            </li>
                        </ul>
                    </SheetContent>
                }
            </Sheet>
        </nav >
    );
}

export default TopNav;
