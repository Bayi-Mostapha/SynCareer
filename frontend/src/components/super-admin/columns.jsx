import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BsThreeDots } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import { toast } from 'sonner';
import { axiosClient } from '@/api/axios';

const handleDelete = async (adminId) => {
    try {
        const res=await axiosClient.delete(`/admins/${adminId}`);
        toast.success(res.data.message);
    } catch (error) {
        console.error('Error deleting job offer:', error);
        toast.error(error.response.data.message);
    }
};

export const columns = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'first_name',
        header: 'First name',
    },
    {
        accessorKey: 'last_name',
        header: 'Last name',
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button
                    className="flex gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Email <IoIosArrowDown />
                </Button>
            );
        },
    },
    {
        id: 'actions',
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => {
            const admin = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 text-gray-400 hover:bg-transparent">
                            <BsThreeDots />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            disabled={admin.role == 's'}
                            onClick={() => handleDelete(admin.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
