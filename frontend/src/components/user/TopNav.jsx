import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import { IoIosLogOut, IoIosMenu } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { USER_HOME_LINK, USER_RESUMES_LINK } from "@/router";

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


import { useContext, useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator"
import { authContext } from "@/contexts/AuthWrapper";


function TopNav() {
    const userContext = useContext(authContext);
    const [open, setOpen] = useState(false);

    useEffect(() => {
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
    return (
        <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-3 lg:py-0 flex items-center bg-background shadow-sm">
            <h1 className="py-2 text-xl text-primary font-semibold">SynCareer</h1>
            <ul className="pt-3 ml-20 hidden lg:flex gap-4">
                <li>
                    <NavLink to={USER_HOME_LINK} className={(navData) => (navData.isActive ? 'border-b-4 border-primary ' : '') + 'py-4 block h-full'}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="t" className={(navData) => (navData.isActive ? 'border-b-4 border-primary ' : '') + 'py-4 block h-full'}>
                        Messages
                    </NavLink>
                </li>
                <li>
                    <NavLink to="tt" className={(navData) => (navData.isActive ? 'border-b-4 border-primary ' : '') + 'py-4 block h-full'}>
                        Interviews
                    </NavLink>
                </li>
                <li>
                    <NavLink to={USER_RESUMES_LINK} className={(navData) => (navData.isActive ? 'border-b-4 border-primary ' : '') + 'py-4 block h-full'}>
                        Resume Library
                    </NavLink>
                </li>
            </ul>

            <DropdownMenu>
                <DropdownMenuTrigger className='ml-auto hidden lg:block'>
                    <div className="py-4 flex gap-3">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                            {userContext.user.first_name}
                            <span className="text-gray-500 text-sm">
                                {userContext.user.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className=' hidden lg:block'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Button className="flex gap-1" onClick={() => { userContext.logout() }}>
                            Log out
                            <IoIosLogOut />
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
                <SheetTrigger className="ml-auto lg:hidden">
                    <IoIosMenu className="text-2xl" />
                </SheetTrigger>
                {
                    open &&
                    <SheetContent>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="py-4 flex gap-3">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start">
                                        {userContext.user.first_name}
                                        <span className="text-gray-500 text-sm">
                                            {userContext.user.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>

                            <Separator />

                            <DropdownMenuContent className="lg:hidden block">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Button className="flex gap-1" onClick={() => { userContext.logout() }}>
                                        Log out
                                        <IoIosLogOut />
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <ul className="py-4">
                            <li>
                                <NavLink to={USER_HOME_LINK} className={(navData) => (navData.isActive ? 'bg-secondary ' : '') + 'p-2 my-4 block h-full'}>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="t" className={(navData) => (navData.isActive ? 'bg-secondary ' : '') + 'p-2 my-4 block h-full'}>
                                    Messages
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="tt" className={(navData) => (navData.isActive ? 'bg-secondary ' : '') + 'p-2 my-4 block h-full'}>
                                    Interviews
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="ttt" className={(navData) => (navData.isActive ? 'bg-secondary ' : '') + 'p-2 my-4 block h-full'}>
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