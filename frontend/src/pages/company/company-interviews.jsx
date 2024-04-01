import { axiosClient } from "@/api/axios";
import CompanyPaddedContent from "@/components/company/padded-content";
import getUserPicture from "@/functions/get-user-pic";
import { useEffect, useState } from "react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { CiVideoOn } from "react-icons/ci";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { COMPANY_CALL } from "@/router";


function CompanyInterviews() {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([])
    useEffect(() => {
        getInterviews()
    }, [])
    async function getInterviews() {
        const res = await axiosClient.get('/all-upcomming-interviews')
        const newInterviews = await Promise.all(res.data.data.map(async interview => {
            const imgRes = await getUserPicture(interview.user_pic)
            return { ...interview, user_pic: imgRes }
        }))
        setInterviews(newInterviews)
    }
    function displayUpcommingInterviews() {
        return interviews.map(interview =>
            <Card key={'i_' + interview.id} >
                <CardHeader>
                    <Avatar className='mx-auto mb-3 w-20 h-20 sm:w-28 sm:h-28'>
                        <AvatarImage src={interview.user_pic} alt={interview.user_name} />
                        <AvatarFallback>
                            {interview.user_fname.charAt(0).toUpperCase() + interview.user_lname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className='capitalize text-center text-lg font-semibold'>{interview.user_fname} {interview.user_lname}</CardTitle>
                    <CardDescription>
                    </CardDescription>
                </CardHeader>
                <CardContent className='text-center text-gray-700'>
                    <p className="mb-2">
                        <Badge>{interview.day}</Badge>
                    </p>
                    <p>
                        From {interview.start_time.slice(0, -3)} to {interview.end_time.slice(0, -3)}
                    </p>
                </CardContent>
                <CardFooter>
                    <Button
                        variant='outline'
                        className='w-full'
                        onClick={async () => {
                            const res = await axiosClient.post('/vid-token', {
                                user_id: interview.user_id
                            })
                            navigate(COMPANY_CALL + '/' + res.data.token)
                        }}
                    >
                        Call
                    </Button>
                </CardFooter>
            </Card>
        )
    }
    return (
        <CompanyPaddedContent>
            <h2 className="text-primary text-xl mb-4">Upcomming interviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayUpcommingInterviews()}
            </div>
        </CompanyPaddedContent>
    );
}

export default CompanyInterviews;