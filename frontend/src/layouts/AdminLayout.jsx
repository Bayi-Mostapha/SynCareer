import { Outlet } from "react-router-dom";

function AdminLayout() {
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

export default AdminLayout;