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
import { Link, useNavigate } from "react-router-dom";
import { COMPANY_CHAT_LINK, VIEW_USER_PROFILE_BASE, VIEW_USER_RESUME_BASE } from "@/router";
import { axiosClient } from "@/api/axios";
import { IoChatbubbleOutline } from "react-icons/io5";

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
        accessorKey: "actions",
        header: "Chat",
        cell: ({ row }) => {
            const navigate = useNavigate()
            return <div>
                {
                    <Button
                        variant='outline'
                        className='flex flex-row gap-2 text-xs'
                        onClick={async () => {
                            const res = await axiosClient.post('/conversations', { user_id: row.original.id })
                            console.log(res)
                            navigate(COMPANY_CHAT_LINK)
                        }}
                    >
                        chat <IoChatbubbleOutline />
                    </Button>
                }
            </div>
        },
    }
]