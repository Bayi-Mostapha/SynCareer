import { axiosClient } from "@/api/axios";
import { columns } from "@/components/company/candidats-table/columns";
import CompanyPaddedContent from "@/components/company/padded-content";
import SynCareerLoader from "@/components/general/syncareer-loader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import SelectionTable from "@/components/company/candidats-table/selection-table";


function JobOfferCandidats() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [isFetching, setisFetching] = useState(false);

    const fetchCandidats = async () => {
        try {
            setisFetching(true);
            const res = await axiosClient.get(`/candidats/${id}`)
            setData(res.data)
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setisFetching(false)
        }
    }
    useEffect(() => {
        fetchCandidats()
    }, []);

    return (
        <CompanyPaddedContent>
            <h1 className="text-lg font-semibold">Candidats for job offer #{id}</h1>
            {
                isFetching ?
                    <div className="h-96 w-full flex justify-center items-center">
                        <SynCareerLoader />
                    </div>
                    :
                    <SelectionTable columns={columns} data={data} searchColumn={"job_title"} />
            }
        </CompanyPaddedContent>
    );
}

export default JobOfferCandidats;