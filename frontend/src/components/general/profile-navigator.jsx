import { authContext } from "@/contexts/AuthWrapper";
import { useContext, useEffect, useState } from "react";
import { USER_PROFILE_LINK } from "@/router";
import { Link } from "react-router-dom";
// shadcn 
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// icons 
import { IoIosLogOut } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";

function ProfileNavigator({ type }) {
    const { user, logout } = useContext(authContext);
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        console.log('menuopen', menuOpen)
    }, [])

    let className = ''
    switch (type) {
        case 'a':
            className = 'ml-auto'
            break;
        case 'ud':
            className = 'hidden lg:block'
            break;
        case 'um':
            className = 'lg:hidden block'
            break;
    }
    return (
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className={className + ' outline-none'}>
                <div className="py-4 flex items-center gap-3">
                    <Avatar>
                        <AvatarImage className='object-cover' src={user.picture} />
                        <AvatarFallback>
                            {user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        {user.first_name}
                        <span className="text-gray-500 text-xs">
                            {user.email}
                        </span>
                    </div>
                    <IoChevronDown className={`${menuOpen && 'rotate-180'} transition-all`} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={className}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {
                    type !== 'a' &&
                    <DropdownMenuItem>
                        <Link to={USER_PROFILE_LINK}>Profile</Link>
                    </DropdownMenuItem>
                }
                <DropdownMenuItem className="flex gap-1" onClick={() => { logout() }}>
                    Log out
                    <IoIosLogOut />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ProfileNavigator;