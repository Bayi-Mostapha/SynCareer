import { axiosClient } from "@/api/axios";
import { columns } from "@/components/company/candidats-table/columns";
import DataTable from "@/components/general/data-table";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function JobOfferCandidats() {
    const { id } = useParams();
    const [data, setData] = useState([]);

    const fetchCandidats = async () => {
        const res = await axiosClient.get(`/candidats/${id}`)
        setData(res.data)
    }
    useEffect(() => {
        fetchCandidats()
    }, [])
    return (
        <>
            <h1 className="text-lg font-semibold">Candidats for job offer #{id}</h1>
            <DataTable columns={columns} data={data} searchColumn={"job_title"} />
        </>
    );
}

export default JobOfferCandidats;