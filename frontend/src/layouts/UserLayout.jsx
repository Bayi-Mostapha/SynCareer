import TopNav from "@/components/user/TopNav";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

function UserLayout() {
    useEffect(() => {
        document.body.classList.add('bg-bbackground')

        return () => {
            document.body.classList.remove('bg-bbackground')
        }
    }, [])
    return (
        <>
            <header>
                <TopNav />
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default UserLayout;