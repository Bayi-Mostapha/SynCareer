import SideBar, { SidebarItem } from "@/components/general/SideNav";
import TopNav from "@/components/general/TopNav";
import { Outlet } from "react-router-dom";
import { PiBriefcaseBold } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";

import { IoHomeOutline } from "react-icons/io5";
import { COMPANY_DASHBOARD_LINK, COMPANY_QUIZ_LINK, JOBOFFER_LINK_BASE } from "@/router";


function CompanyLayout() {
    return (
        <>
            <header>
                <TopNav />
            </header>
            <SideBar>
                <SidebarItem icon={<IoHomeOutline />} text={'Home'} location={COMPANY_DASHBOARD_LINK} />
                <SidebarItem icon={<PiBriefcaseBold />} text={'Job Upload'} location={JOBOFFER_LINK_BASE} />
                <SidebarItem icon={<FaFileCircleQuestion />} text={'Quiz Management'} location={COMPANY_QUIZ_LINK} />
            </SideBar>
            <main className="">
                <Outlet />
            </main>
        </>
    );
}

export default CompanyLayout;