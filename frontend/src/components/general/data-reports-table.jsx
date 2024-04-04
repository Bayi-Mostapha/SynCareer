import { useState } from "react";
import { axiosClient } from "@/api/axios";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
// icons 
import { IoIosArrowDown } from "react-icons/io";

export default function DataTable({ columns, data, searchColumn,id ,onDelete}) {
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState([])

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
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });
     

    return (
        <div className="my-4 border rounded-xl">
            <div className="px-5 py-6 flex justify-between items-center">
               <div> 
                    <h3 className="text-gray-800 text-lg font-medium">Reports List for job offer #{id}</h3>
                </div>
                <div className="flex justify-center items-center">
                {data.length != 0 && 
                    <button 
                    className="py-2 px-5 bg-red-500 text-white rounded-md"
                    onClick={onDelete}
                    >Delete Job Offer</button>
                }
                </div>
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
                        table.getRowModel().rows.map((row, i) => (
                            <TableRow
                                className={`${((i + 1) % 2 === 0) ? 'bg-[#FCFCFC]' : ''}`}
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

            <div className="mt-2 flex items-center justify-end gap-4 px-5">
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
