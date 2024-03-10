import { createContext, useEffect, useState } from "react";
import { axiosClient } from "../api/axios";

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
            setIsLoggedIn(true);
            const newUser = { ...userResponse.data.user, type: userResponse.data.type };
            setUser(newUser);
        } catch (err) {
            setIsLoggedIn(false);
            setUser({});
            localStorage.removeItem('token');
            console.error("error from AuthWrapper: ", err);
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