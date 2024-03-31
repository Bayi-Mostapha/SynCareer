import { axiosClient } from "@/api/axios";
import { columns } from "@/components/company/candidats-table/columns";
import CompanyPaddedContent from "@/components/company/padded-content";
import SynCareerLoader from "@/components/general/syncareer-loader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import SelectionTable from "@/components/company/candidats-table/selection-table";
import MyDatePicker from "../user/calendar/calendar-fill";
import { Button } from "@/components/ui/button";
import { FaCalendarDays } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

function JobOfferCandidats() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [isFetching, setisFetching] = useState(false);
    const [calendarExists, setCalendarExists] = useState(false);
    const [calendarShown, setCalendarShown] = useState(false);

    const getData = async () => {
        try {
            setisFetching(true);
            const res = await axiosClient.get(`/candidats/${id}`)
            setData(res.data)

            const res2 = await axiosClient.get(`/calendar-exists/${id}`)
            setCalendarExists(res2.data.exists)
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setisFetching(false)
        }
    }
    useEffect(() => {
        getData()
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
                    <div>
                        {
                            !calendarExists &&
                            <Button variant="outline" className="flex gap-2 items-center ml-auto" onClick={() => { setCalendarShown(prev => !prev) }}>
                                {calendarShown ? 'Hide calendar' : 'Add calendar'}
                                <FaCalendarDays className="text-sm" />
                            </Button>
                        }
                        <AnimatePresence>
                            {
                                calendarShown && !calendarExists &&
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <MyDatePicker />
                                </motion.div >
                            }
                        </AnimatePresence>
                        <SelectionTable
                            columns={columns}
                            data={data}
                            searchColumn={"job_title"}
                            calendarExists={calendarExists}
                            jobOfferId={id}
                        />
                    </div>
            }
        </CompanyPaddedContent>
    );
}

export default JobOfferCandidats;