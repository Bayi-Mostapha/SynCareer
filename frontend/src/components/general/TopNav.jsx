import ProfileNavigator from "./profile-navigator";

function TopNav() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-0 flex items-center bg-background shadow">
            <ProfileNavigator type='a' />
        </nav >
    );
}

export default TopNav;