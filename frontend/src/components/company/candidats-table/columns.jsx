import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
// icons 
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { VIEW_USER_PROFILE_BASE, VIEW_USER_RESUME_BASE } from "@/router";

export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "matching",
        header: "MP",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("matching"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "percent",
                minimumFractionDigits: 2,
            }).format(amount);

            return <>{formatted}</>
        },
    },
    {
        accessorKey: "first_name",
        header: "First name",
    },
    {
        accessorKey: "last_name",
        header: "Last name",
    },
    {
        accessorKey: "job_title",
        header: "Job title",
        cell: ({ row }) => {
            return <div>
                {row.getValue("job_title") || '-'}
            </div>
        },
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
        accessorKey: "details",
        header: "Details",
        cell: ({ row }) => {
            return <div>
                {
                    row.original.resume_id ?
                        <Link className="text-nowrap text-sm text-primary" to={VIEW_USER_RESUME_BASE + row.original.resume_id}>
                            view resume
                        </Link>
                        :
                        <Link className="text-nowrap text-sm text-primary" to={VIEW_USER_PROFILE_BASE + row.original.id}>
                            view profile
                        </Link>
                }
            </div>
        },
    },
    {
        id: "actions",
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
            const candidat = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 text-gray-400 hover:bg-transparent">
                            <BsThreeDots />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]