import { axiosClient } from "@/api/axios";
import { columns } from "@/components/admin/reports-columns";
import DataTable from "@/components/general/data-reports-table";
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
function usersTable() {
    const { jid } = useParams();

    useEffect(() => {
       
        console.log('heeeey ',jid);
        if (jid) {
            fetchReports(jid);

        }
    }, [jid]);
    const [data, setData] = useState([]);
    const fetchReports = async (jid) => {
        try {
            const { data } = await axiosClient.get(`/reports/${jid}`);
          
            setData(data.reports)
            console.log('heeeey ',data);
            console.log('heeeey ',jid);
        } catch (error) {
            console.log('Error fetching conversations:', error);
        }
    };
    const handleDelete = (id) => {
        deleteReports(id);
        fetchReports();
    };
   
     const deleteReports = async (jid) => {
        try {
            await axiosClient.delete(`/deleteReports/${jid}`);
        } catch (error) {
            console.log('Error deleting job offer ', error);
        }
    };
    return (  <div className="  px-6 mb-10 overflow-x-auto">
        <DataTable columns={columns} data={data} searchColumn={"name"} id={jid} onDelete={()=>handleDelete(jid)}/>
    </div>);
}

export default usersTable;