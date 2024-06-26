import SideBar, { SidebarItem } from "@/components/general/SideNav";
import TopNav from "@/components/general/TopNav";
import { Outlet } from "react-router-dom";
import { PiBriefcaseBold } from "react-icons/pi";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { IoChatbubblesOutline } from "react-icons/io5";
import { TbCalendarTime } from "react-icons/tb";

import { IoHomeOutline } from "react-icons/io5";
import { COMPANY_CHAT_LINK, COMPANY_DASHBOARD_LINK, COMPANY_INTERVIEW, COMPANY_QUIZ_LINK, JOBOFFER_LINK_BASE } from "@/router";


function CompanyLayout() {
    return (
        <>
            <header>
                <TopNav />
            </header>
            <SideBar>
                <SidebarItem icon={<IoHomeOutline />} text={'Dashboard'} location={COMPANY_DASHBOARD_LINK} />
                <SidebarItem icon={<IoChatbubblesOutline />} text={'Conversations'} location={COMPANY_CHAT_LINK} />
                <SidebarItem icon={<PiBriefcaseBold />} text={'Job Management'} location={JOBOFFER_LINK_BASE} />
                <SidebarItem icon={<TbCalendarTime />} text={'Interviews'} location={COMPANY_INTERVIEW} />
                <SidebarItem icon={<HiOutlineClipboardDocumentCheck />} text={'Quiz Library'} location={COMPANY_QUIZ_LINK} />
            </SideBar>
            <main className="">
                <Outlet />
            </main>
        </>
    );
}

export default CompanyLayout;