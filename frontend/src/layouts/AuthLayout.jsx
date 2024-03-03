import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { authContext } from "../contexts/AuthWrapper";

function AuthLayout() {
    const userContext = useContext(authContext);

    return (
        <>
            {
                userContext.isFetchingUser ?
                    <p>loading...</p>
                    :
                    <main className="h-screen flex sm:justify-between justify-center items-center">
                        <div className="px-10 py-12 hidden lg:block w-2/5 h-full bg-primary">
                            <h1 className="font-semibold text-white text-xl">SynCareer</h1>
                            <h2 className="font-medium text-white text-4xl">Start your journey with us</h2>
                            <p className="font-light text-white">Lorem ipsum dolor sit amet consectetur. Feugiat odio varius placerat posuere feugiat. Ameet neque quam purus volutpat ornarecelerisque </p>
                        </div>
                        <Outlet />
                    </main>
            }
        </>
    );
}

export default AuthLayout;