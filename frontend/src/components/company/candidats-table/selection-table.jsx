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
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
// icons 
import { IoIosArrowDown } from "react-icons/io";

export default function SelectionTable({ columns, data, searchColumn }) {
    const [quizzes, setQuizzes] = useState([]);
    const [isFetching, setisFetching] = useState(false);

    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState([])
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
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
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
        try {
            let res = await axiosClient.post('/send-quiz', formData)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="my-4">
            <Dialog>
                <DialogTrigger>send quiz</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Your quizzes</DialogTitle>
                        <DialogDescription>
                            Choose a quiz to send it to selected users
                        </DialogDescription>
                        <ScrollArea className="h-96">
                            {displayQuizzes()}
                        </ScrollArea>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <div className="flex justify-center items-center py-4">
                <Input
                    placeholder={`Seach by Job Title...`}
                    value={(table.getColumn(searchColumn)?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table.getColumn(searchColumn)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto flex items-center gap-2">
                            Columns <IoIosArrowDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) => column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="my-2 text-xs text-muted-foreground">
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
