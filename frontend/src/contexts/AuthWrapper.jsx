import { createContext, useEffect, useState } from "react";
import { axiosClient } from "../api/axios";

export const authContext = createContext({
    isFetchingUser: false,
    setIsFetchingUser: () => { },
    user: {},
    setUser: () => { },
    logout: () => { },
    isLoggedIn: false,
    setIsLoggedIn: () => { }
})

export function AuthWrapper({ children }) {
    const [isFetchingUser, setIsFetchingUser] = useState(false)
    const [user, setUser] = useState({})
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        getUser()
    }, [])

    const getUser = () => {
        if (localStorage.getItem('token') == null) {
            return;
        }

        setIsFetchingUser(true)
        axiosClient.get('/user').then(userResponse => {
            setIsLoggedIn(true)
            const newUser = { ...userResponse.data.user, type: userResponse.data.type };
            setUser(newUser);
        }).catch(err => {
            setIsLoggedIn(false)
            setUser({})
            localStorage.removeItem('token')
            console.error("error from AuthWrapper: ", err);
        }).finally(() => {
            setIsFetchingUser(false)
        });
    }

    const logout = async () => {
        await axiosClient.post('/logout');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser({});
    }

    return <>
        <authContext.Provider value={{
            isFetchingUser, setIsFetchingUser, user, setUser, logout, isLoggedIn, setIsLoggedIn
        }}>
            {children}
        </authContext.Provider>
    </>
}