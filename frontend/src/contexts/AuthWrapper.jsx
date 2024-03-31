import { createContext, useState } from "react";
import { axiosClient } from "../api/axios";
import getUserPicture from "@/functions/get-user-pic";

export const authContext = createContext({
    currLocation: '',
    setCurrLocation: () => { },
    isFetchingUser: false,
    setIsFetchingUser: () => { },
    user: {},
    setUser: () => { },
    logout: () => { },
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    getUser: () => { },
})

export function AuthWrapper({ children }) {
    const [currLocation, setCurrLocation] = useState('')
    const [isFetchingUser, setIsFetchingUser] = useState(false)
    const [user, setUser] = useState({})
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const getUser = async () => {
        setIsFetchingUser(true);
        try {
            const userResponse = await axiosClient.get('/user');

            let picture = await getUserPicture(userResponse.data.user?.picture)

            const newUser = {
                ...userResponse.data.user,
                picture: picture,
                type: userResponse.data.type
            };
            setUser(newUser);
            setIsLoggedIn(true);
        } catch (err) {
            setIsLoggedIn(false);
            setUser({});
            localStorage.removeItem('token');
            console.error("Error from AuthWrapper:", err);
        } finally {
            setIsFetchingUser(false);
        }
    };


    const logout = async () => {
        try {
            await axiosClient.post('/logout');
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUser({});
        } catch (err) {
            console.error("error logging out: ", err);
        }
    };


    return <>
        <authContext.Provider value={{
            currLocation, setCurrLocation,
            isFetchingUser, setIsFetchingUser,
            user, setUser,
            logout,
            isLoggedIn, setIsLoggedIn,
            getUser,
        }}>
            {children}
        </authContext.Provider>
    </>
}