import { Link } from "react-router-dom";
// shadcn 
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { JOBOFFER_LINK_BASE } from "@/router";
// icons 
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

export const columns = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    className="flex gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email <IoIosArrowDown />
                </Button>
            )
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        id: "actions",
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
            const jobOffer = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 text-gray-400 hover:bg-transparent">
                            <BsThreeDots />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Link to={`${JOBOFFER_LINK_BASE}/${jobOffer.id}` }>view candidats</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(jobOffer.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]