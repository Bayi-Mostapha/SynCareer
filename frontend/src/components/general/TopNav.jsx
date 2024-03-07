import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import { IoIosLogOut } from "react-icons/io";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useContext } from "react";

import { authContext } from "@/contexts/AuthWrapper";


function TopNav() {
    const userContext = useContext(authContext);

    return (
        <nav className="fixed top-0 left-0 right-0 z-20 px-6 py-3 md:py-0 flex items-center  bg-background">
            <DropdownMenu>
                <DropdownMenuTrigger className='ml-auto'>
                    <div className="py-4 flex gap-3">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:flex flex-col items-start">
                            {userContext.user.name}
                            <span className="text-gray-500 text-sm">
                                {userContext.user.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        <h2 className="hidden sm:block">My account</h2>
                        <div className="sm:hidden flex flex-col items-start">
                            {userContext.user.name}
                            <span className="font-light text-gray-400 text-xs">
                                {userContext.user.email}
                            </span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Button className="flex gap-1" onClick={() => { userContext.logout() }}>
                            Log out
                            <IoIosLogOut />
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav >
    );
}

export default TopNav;