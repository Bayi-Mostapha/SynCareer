import SideBar, { SidebarItem } from "@/components/general/SideNav";
import TopNav from "@/components/general/TopNav";
import { Outlet } from "react-router-dom";

import { IoHomeOutline } from "react-icons/io5";
import { COMPANY_DASHBOARD_LINK } from "@/router";

function CompanyLayout() {
    return (
        <>
            <header>
                <TopNav />
            </header>
            <SideBar>
                <SidebarItem icon={<IoHomeOutline/>} text={'home'} location={COMPANY_DASHBOARD_LINK}/>
            </SideBar>
            <main className="p-4 pt-24 pl-24">
                <Outlet />
            </main>
        </>
    );
}

export default CompanyLayout;