import { axiosClient } from "@/api/axios";
import { columns } from "@/components/company/candidats-table/columns";
import CompanyPaddedContent from "@/components/company/padded-content";
import DataTable from "@/components/general/data-table";
import SynCareerLoader from "@/components/general/syncareer-loader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
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


function JobOfferCandidats() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [isFetching, setisFetching] = useState(false);

    const fetchCandidats = async () => {
        try {
            setisFetching(true);
            const res = await axiosClient.get(`/candidats/${id}`)
            setData(res.data)
            const res2 = await axiosClient.get(`/quizzes`)
            setQuizzes(res2.data)
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setisFetching(false)
        }
    }
    useEffect(() => {
        fetchCandidats()
    }, []);

    const displayQuizzes = () => {
        return quizzes.map((item) => {
            return <div
                key={"quiz_" + item.id}
                className="p-2 cursor-pointer hover:bg-muted rounded"
                onClick={() => { sendQuiz(data[0].id, item.id) }}
            >
                {item.name}
            </div>
        })
    }

    const sendQuiz = async (user_id, quiz_id) => {
        const formData = new FormData();
        formData.append('user_id', user_id)
        formData.append('quiz_id', quiz_id)
        try {
            let res = await axiosClient.post('/send-quiz', formData)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <CompanyPaddedContent>
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

            <h1 className="text-lg font-semibold">Candidats for job offer #{id}</h1>
            {isFetching ?
                <div className="h-96 w-full flex justify-center items-center">
                    <SynCareerLoader />
                </div>
                :
                <DataTable columns={columns} data={data} searchColumn={"job_title"} />
            }
        </CompanyPaddedContent>
    );
}

export default JobOfferCandidats;