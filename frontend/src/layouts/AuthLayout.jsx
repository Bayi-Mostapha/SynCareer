import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { authContext } from "../contexts/AuthWrapper";

import * as React from "react"

import { LuLoader2 } from "react-icons/lu";
import Side from "@/components/auth/Side";

function AuthLayout() {
    const userContext = useContext(authContext);

    return (
        <main className="h-screen flex sm:justify-between justify-center items-center">
            <Side />
            <Outlet />
        </main >
    );
}

export default AuthLayout;