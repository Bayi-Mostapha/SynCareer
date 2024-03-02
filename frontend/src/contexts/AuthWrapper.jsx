import { createContext, useEffect, useState } from "react";
import { axiosClient } from "../api/axios";

export const authContext = createContext({
    user: {},
    setUser: () => { },
    logout: () => { },
    isLoggedIn: false,
    setIsLoggedIn: () => { }
})

export function AuthWrapper({ children }) {
    const [user, setUser] = useState({})
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        await axiosClient.get('/user').then(userResponse => {
            setIsLoggedIn(true)
            setUser(userResponse.data)
        }).catch(err => {
            setIsLoggedIn(false)
            setUser({})
            localStorage.removeItem('token')
            console.log(err);
        });
    }

    const logout = async () => {
        await axiosClient.post('/logout');
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        setUser({})
    }

    return <>
        <authContext.Provider value={{
            user, setUser, logout, isLoggedIn, setIsLoggedIn
        }}>
            {children}
        </authContext.Provider>
    </>
}