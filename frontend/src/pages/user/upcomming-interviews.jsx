import { useEffect, useState } from "react";
import { axiosClient } from "@/api/axios";
import UserPaddedContent from "@/components/user/padded-content";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge";
import getUserPicture from "@/functions/get-user-pic";

function UpcommingInterviews() {
    const [interviews, setInterviews] = useState([])
    async function getData() {
        const res = await axiosClient.get('/user-upcomming-interviews');
        const newInterviews = await Promise.all(res.data.data.map(async interview => {
            const imgRes = await getUserPicture(interview.company_pic, 'company')
            return { ...interview, company_pic: imgRes }
        }))
        setInterviews(newInterviews)
    }
    useEffect(() => {
        getData()
    }, [])

    function displayUpcommingInterviews() {
        return interviews.map(interview =>
            <Card key={'i_' + interview.id} >
                <CardHeader>
                    <Avatar className='mx-auto mb-3 w-20 h-20 sm:w-28 sm:h-28'>
                        <AvatarImage src={interview.company_pic} alt={interview.company_name} />
                        <AvatarFallback>
                            {interview.company_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className='capitalize text-center text-lg font-semibold'>
                        {interview.company_name}
                    </CardTitle>
                </CardHeader>
                <CardContent className='text-center text-gray-700'>
                    <p className="mb-2">
                        <Badge>{interview.day}</Badge>
                    </p>
                    <p>
                        From {interview.start_time.slice(0, -3)} to {interview.end_time.slice(0, -3)}
                    </p>
                </CardContent>
            </Card>
        )
    }
    return (
        <UserPaddedContent>
            <h2 className="text-xl font-semibold mb-4">Upcomming interviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayUpcommingInterviews()}
            </div>
        </UserPaddedContent>
    );
}

export default UpcommingInterviews;