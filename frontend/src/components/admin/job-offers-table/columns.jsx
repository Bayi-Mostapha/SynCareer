import { Button } from '@/components/ui/button';
import { ADMINS_REPORTS } from '@/router';
import { IoIosArrowDown } from 'react-icons/io';
import { Link } from 'react-router-dom';

export const columns = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'job_title',
        header: ({ column }) => {
            return (
                <Button
                    className="flex gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Job Title <IoIosArrowDown />
                </Button>
            );
        },
    },
    {
        accessorKey: 'location',
        header: 'Location',
    },
    {
        accessorKey: 'workplace_type',
        header: 'Workplace Type',
    },
    {
        accessorKey: 'workhours_type',
        header: 'Workhours ',
    },
    {
        accessorKey: 'exp_years',
        header: 'Years of Experience',
    },
    {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => {
            return <Link className='text-yellow-600 underline' to={ADMINS_REPORTS + '/' + row.original.id}>
                Reports
            </Link>
        }
    },
];
