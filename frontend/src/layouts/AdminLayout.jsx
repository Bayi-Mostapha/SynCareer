import SideBar, { SidebarItem } from "@/components/general/SideNav";
import TopNav from "@/components/general/TopNav";
import { authContext } from "@/contexts/AuthWrapper";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { ADMINS_LINK } from "@/router";

function AdminLayout() {
    const { user } = useContext(authContext)
    return (
        <>
            <header>
                <TopNav />
            </header>
            <SideBar>
                {
                    user.role == 's' &&
                    <SidebarItem icon={<MdOutlineAdminPanelSettings />} text={'Admins'} location={ADMINS_LINK} />
                }
            </SideBar>
            <main className="p-4 pt-24 pl-24">
                <Outlet />
            </main>
        </>
    );
}

export default AdminLayout;