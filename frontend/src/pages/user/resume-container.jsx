import UserPaddedContent from "@/components/user/padded-content";
import { Outlet } from "react-router-dom";

function ResumeContainer() {
    return (
        <UserPaddedContent>
            <Outlet />
        </UserPaddedContent>
    );
}

export default ResumeContainer;