import { Outlet } from "react-router-dom";

function UserLayout() {
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

export default UserLayout;