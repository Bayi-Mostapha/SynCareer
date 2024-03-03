import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { LOGIN_LINK } from "..";

export default function CompanyRoute({ children }) {
    const { isLoggedIn, user } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) { // && user.type !== 'company'
            navigate(LOGIN_LINK);
        }
    }, [isLoggedIn, navigate]);

    return isLoggedIn ? children : null; // && user.type === 'company'
}