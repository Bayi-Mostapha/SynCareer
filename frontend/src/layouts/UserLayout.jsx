import TopNav from "@/components/user/TopNav";
import { Outlet } from "react-router-dom";

function UserLayout() {
    return (
        <>
            <header>
                <TopNav />
            </header>
            <main className="p-4 pt-24">
                <Outlet />
            </main>
        </>
    );
}

export default UserLayout;