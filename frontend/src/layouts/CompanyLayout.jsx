import SideBar, { SidebarItem } from "@/components/general/SideNav";
import TopNav from "@/components/general/TopNav";
import { Outlet } from "react-router-dom";
import { PiBriefcaseBold } from "react-icons/pi";

import { IoHomeOutline } from "react-icons/io5";
import { COMPANY_DASHBOARD_LINK , JOBOFFER_LINK } from "@/router";


function CompanyLayout() {
    return (
        <>
            <header>
                <TopNav />
            </header>
            <SideBar>
                <SidebarItem icon={<IoHomeOutline/>} text={'Home'} location={COMPANY_DASHBOARD_LINK}/>
                <SidebarItem icon={<PiBriefcaseBold />} text={'Job Upload'} location={JOBOFFER_LINK}/>
            </SideBar>
            <main className="p-4 pt-24 pl-24">
                <Outlet />
            </main>
        </>
    );
}

export default CompanyLayout;