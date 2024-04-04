import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IoIosArrowDown } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { axiosClient } from "@/api/axios";

export const columns = [
    {
        accessorKey: "id",
        header: "id  ",
    },
    {
        accessorKey: "name",
        header: "full name",
    },
    {
        accessorKey: "job_title",
        header: "job title ",
    }
    ,
    {
        accessorKey: "phone_number",
        header: "phone number",
    }
    ,{
        accessorKey: "email",
        header: "email",
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    className="flex gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    created at <IoIosArrowDown />
                </Button>
            )
        },
    },
   
];
