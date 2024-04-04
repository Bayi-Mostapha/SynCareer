import { axiosClient } from '../../api/axios';
import DataTable from "@/components/general/data-table";
import { columns } from '@/components/company/quiz/columns';
import { useEffect, useState } from 'react';
import CompanyPaddedContent from '@/components/company/padded-content';
import { useParams } from 'react-router-dom';
import getUserPicture from '@/functions/get-user-pic';

function JobOfferQuiz() {
    const { id } = useParams()
    const [result, setResult] = useState([]);

    const fetchResults = async () => {
        try {
            const response = await axiosClient.get('/quiz-results/' + id);
            const newResults = await Promise.all(response.data.map(async result => {
                return {
                    ...result,
                    user_name: `${result.user.first_name} ${result.user.last_name}`,
                    picture: await getUserPicture(result.user.picture)
                };
            }));
            setResult(newResults);
        } catch (error) {
            console.error('Error fetching job offers:', error);
        }
    };
    useEffect(() => {
        fetchResults();
    }, []);

    return (
        <CompanyPaddedContent>
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-medium">Quiz resultes for job offer #{id}</h1>
            </div>
            <DataTable columns={columns} data={result} searchColumn={"user_name"} title="Quiz resultes" />
        </CompanyPaddedContent>
    );
}


export default JobOfferQuiz;
