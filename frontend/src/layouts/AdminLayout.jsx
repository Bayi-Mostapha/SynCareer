import SideBar, { SidebarItem } from "@/components/general/SideNav";
import TopNav from "@/components/general/TopNav";
import { authContext } from "@/contexts/AuthWrapper";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { ADMINS_LINK, ADMINS_USERS, ADMIN_DASHBOARD_LINK, ADMIN_JOB_OFFERS } from "@/router";
import { FaUsers } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { PiBriefcaseBold } from "react-icons/pi";

function AdminLayout() {
    const { user } = useContext(authContext)
    return (
        <>
            <header>
                <TopNav />
            </header>
            <SideBar>
                <SidebarItem icon={<IoHomeOutline />} text={'Dashboard'} location={ADMIN_DASHBOARD_LINK} />
                {
                    user.role == 's' &&
                    <SidebarItem icon={<MdOutlineAdminPanelSettings />} text={'Admins'} location={ADMINS_LINK} />
                }
                <SidebarItem icon={<FaUsers />} text={'Users'} location={ADMINS_USERS} />
                <SidebarItem icon={<PiBriefcaseBold />} text={'Job Offers'} location={ADMIN_JOB_OFFERS} />
            </SideBar>
            <main className="p-4 pt-24 pl-24">
                <Outlet />
            </main>
        </>
    );
}

export default AdminLayout;