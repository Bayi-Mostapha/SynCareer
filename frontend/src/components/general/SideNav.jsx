import { useContext, createContext, useState } from "react"
import { NavLink } from "react-router-dom"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Button } from "../ui/button";

const SidebarContext = createContext()

export default function SideBar({ children }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <aside className="side-nav h-screen w-fit fixed top-0 left-0 z-50 shadow">
            <nav className="h-full flex flex-col bg-background">
                <div className="p-4 flex justify-between items-center">
                    <h1
                        className={`py-2 text-xl text-primary font-semibold overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
                    >
                        SynCareer
                    </h1>
                    <Button
                        variant='ghost'
                        onClick={() => setExpanded((curr) => !curr)}
                    >
                        {expanded ? <FaChevronLeft /> : <FaChevronRight />}
                    </Button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <div className="flex-1 px-3">{children}</div>
                </SidebarContext.Provider>
            </nav>
        </aside>
    )
}

export function SidebarItem({ icon, text, location, alert }) {
    const { expanded } = useContext(SidebarContext)

    return (
        <NavLink
            to={location}
            className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group hover:bg-secondary text-gray-600`}
        >
            {icon}
            <span
                className={`overflow-hidden transition-all ${expanded ? "ml-3" : "w-0"}`}
            >
                {text}
            </span>

            {/* alert is for notifications */}
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-primary ${expanded ? "" : "top-2"}`}
                />
            )}

            {!expanded && (
                <div
                    className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-secondary text-primary text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                >
                    {text}
                </div>
            )}
        </NavLink>
    )
}