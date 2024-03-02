import { Outlet } from "react-router-dom";

function CompanyLayout() {
    return (
        <>
            <header>
                <nav>
                    nav
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default CompanyLayout;