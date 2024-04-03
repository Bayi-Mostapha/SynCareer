import { useEffect, useState } from "react";
import { axiosClient } from "@/api/axios";
// tanstack 
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    getFilteredRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";
// shadcn 
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
// components
import SynCareerLoader from "@/components/general/syncareer-loader";
// icons 
import { TbCalendarShare } from "react-icons/tb";
import { FiSearch } from "react-icons/fi";
import { GrSend } from "react-icons/gr";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { QUIZ_RESULTS_LINK } from "@/router";

export default function SelectionTable({ columns, data, searchColumn, calendarExists, quizId, jobOfferId }) {
    const [quizzes, setQuizzes] = useState([]);
    const [isFetching, setisFetching] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [rowSelection, setRowSelection] = useState({})

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setisFetching(true);
                const res = await axiosClient.get(`/quizzes`)
                setQuizzes(res.data)
            } catch (error) {
                toast.error(error.response.data.message)
            } finally {
                setisFetching(false)
            }
        }
        fetchQuizzes()
    }, [])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection
        },
    });

    const displayQuizzes = () => {
        return quizzes.map((item) => {
            return <div
                key={"quiz_" + item.id}
                className="p-2 cursor-pointer hover:bg-muted rounded"
                onClick={() => { sendQuiz(item.id) }}
            >
                {item.name}
            </div>
        })
    }

    const sendQuiz = async (quiz_id) => {
        const users_ids = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);

        const formData = new FormData();
        formData.append('users_ids', JSON.stringify(users_ids))
        formData.append('quiz_id', quiz_id)
        formData.append('job_offer_id', jobOfferId)
        try {
            setIsSending(true)
            let res = await axiosClient.post('/send-quiz', formData)
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setIsSending(false)
        }
    }
    const sendCalendar = async () => {
        const users_ids = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);

        const formData = new FormData();
        formData.append('users_ids', JSON.stringify(users_ids))
        formData.append('job_offer_id', jobOfferId)
        try {
            setIsSending(true)
            let res = await axiosClient.post('/send-calendar-candidats', formData)
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="my-4">
            <div className="flex justify-end gap-2">
                {
                    quizId == 0 ?
                        (table.getFilteredSelectedRowModel().rows.length > 0 &&
                            <Dialog>
                                <DialogTrigger disabled={isSending}>
                                    <Button
                                        className='flex items-center gap-2'
                                        variant='outline'
                                    >
                                        Set and send quiz <HiOutlineDocumentPlus className="text-xl" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Your quizzes</DialogTitle>
                                        <DialogDescription>
                                            Choose a quiz for this job offer (it will be automatically sent it to selected users)
                                        </DialogDescription>
                                        {
                                            isFetching ?
                                                <SynCareerLoader />
                                                :
                                                <ScrollArea className="h-96">
                                                    {displayQuizzes()}
                                                </ScrollArea>
                                        }
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        )
                        :
                        (
                            table.getFilteredSelectedRowModel().rows.length > 0 &&
                            <Button
                                className='flex items-center gap-2'
                                onClick={() => sendQuiz(quizId)}
                                variant='outline'
                            >
                                Send quiz <GrSend />
                            </Button>
                        )
                }
                {
                    table.getFilteredSelectedRowModel().rows.length > 0 && calendarExists &&
                    <Button
                        className='flex items-center gap-2'
                        disabled={isSending}
                        variant='outline'
                        onClick={sendCalendar}
                    >
                        Send calendar <TbCalendarShare />
                    </Button>
                }
            </div>
            <div className="flex justify-between items-center py-4">
                <h1 className="text-lg font-medium">
                    Candidats for job offer #{jobOfferId}
                </h1>
                <div className="relative">
                    <FiSearch className="text-lg text-gray-300 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    <Input
                        placeholder={`Seach by Job Title...`}
                        value={(table.getColumn(searchColumn)?.getFilterValue()) ?? ""}
                        onChange={(event) =>
                            table.getColumn(searchColumn)?.setFilterValue(event.target.value)
                        }
                        className="pl-8 py-5 max-w-72"
                    />
                </div>
            </div>
            {
                quizId != 0 &&
                <Link to={QUIZ_RESULTS_LINK} className="text-primary">view quiz resultes →</Link>
            }
            <div className="mb-2 text-xs text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* pagination controlls */}
            <div className="mt-2 flex items-center justify-end gap-4">
                {
                    table.getCanPreviousPage() &&
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                    >
                        Previous
                    </Button>
                }
                {
                    table.getCanNextPage() &&
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                    >
                        Next
                    </Button>
                }
            </div>
        </div>
    )
}
