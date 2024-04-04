import { axiosClient } from "@/api/axios";
import { columns } from "@/components/user/users-columns";
import DataTable from "@/components/general/data-users-table";
import React, { useState, useEffect } from 'react';

function usersTable() {
    const [data, setData] = useState([]);
    const fetchQuizes = async () => {
        try {
            const { data } = await axiosClient.get('/users');
            console.log('broiiiii ', data);
            setData(data)
            console.log(data);
        } catch (error) {
            console.log('Error fetching conversations:', error);
        }
    };

    useEffect(() => {
        fetchQuizes();
    }, []);

    return (
        <div className="px-6 mb-10 overflow-x-auto">
            <DataTable columns={columns} data={data} searchColumn={"name"} />
        </div>
    )
}

export default usersTable;