import TopNav from "@/components/general/TopNav";
import { Outlet } from "react-router-dom";

function CompanyLayout() {
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

export default CompanyLayout;