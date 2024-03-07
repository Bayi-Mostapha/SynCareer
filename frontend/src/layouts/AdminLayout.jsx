import SideBar, { SidebarItem } from "@/components/general/SideNav";
import TopNav from "@/components/general/TopNav";
import { Outlet } from "react-router-dom";

function AdminLayout() {
    return (
        <>
            <header>
                <TopNav />
            </header>
            <SideBar>

            </SideBar>
            <main className="p-4 pt-24 pl-24">
                <Outlet />
            </main>
        </>
    );
}

export default AdminLayout;