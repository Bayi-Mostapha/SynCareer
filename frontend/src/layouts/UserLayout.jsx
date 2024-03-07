import TopNav from "@/components/user/TopNav";
import { Outlet } from "react-router-dom";

function UserLayout() {
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