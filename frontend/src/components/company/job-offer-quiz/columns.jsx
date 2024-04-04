import { Button } from '@/components/ui/button';
import { IoIosArrowDown } from 'react-icons/io';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import formatDistanceToNow from '@/functions/format-time';
import { Badge } from '@/components/ui/badge';

export const columns = [
    {
        accessorKey: 'picture',
        header: 'Picture',
        cell: ({ row }) => {
            return <Avatar>
                <AvatarImage src={row.getValue("picture")} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

        },
    },
    {
        accessorKey: 'user_name',
        header: ({ column }) => {
            return (
                <Button
                    className="flex gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    User <IoIosArrowDown />
                </Button>
            );
        },
    },
    {
        accessorKey: 'quiz_id',
        header: 'Quiz id',
    },
    {
        accessorKey: 'score',
        header: ({ column }) => {
            return (
                <Button
                    className="flex gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Score <IoIosArrowDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            return parseFloat(row.getValue('score')).toFixed(2)
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            return row.getValue("status") == 'passed' ? <Badge>{row.getValue("status")}</Badge> : <Badge variant='destructive'>{row.getValue("status")}</Badge>
        },
    },
    {
        accessorKey: 'updated_at',
        header: 'Passed',
        cell: ({ row }) => {
            return row.getValue("status") == 'passed' ? formatDistanceToNow(row.getValue("updated_at")) : '-'
        },
    },
];
