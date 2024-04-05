// shadcn 
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
// nivo
import { ResponsiveLineCanvas } from "@nivo/line"
import CompanyPaddedContent from "@/components/company/padded-content"
import { useContext, useEffect, useState } from "react"
import { axiosClient } from "@/api/axios"
import { COMPANY_CHAT_LINK, COMPANY_INTERVIEW } from "@/router"
import { Link } from "react-router-dom"
import formatDistanceToNow from "@/functions/format-time"
import getUserPicture from "@/functions/get-user-pic"
import { authContext } from "@/contexts/AuthWrapper"

export default function CompanyDashboard() {
    const { user } = useContext(authContext)
    const [latestApplies, setLatestApplies] = useState([])
    const [upcommingInterviews, setUpcommingInterviews] = useState([])

    useEffect(() => {
        getLatestApplies()
        getUpcommingInterviews()
    }, [])

    async function getLatestApplies() {
        try {
            const res = await axiosClient.get('/latest-applies')
            setLatestApplies(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    function displayLatestApplies() {
        return latestApplies.map(apply =>
            <div className="p-2 bg-muted shadow-md rounded-sm" key={'a_' + apply.id}>
                <p className="text-sm text-primary font-semibold">
                    <span className="capitalize">{apply.job_offer_title}</span> at <span className="capitalize">{apply.location}</span>
                </p>
                <p className="text-xs text-gray-600">
                    <span className="capitalize">{apply.user_name}</span> applied {formatDistanceToNow(apply.date)}
                </p>
            </div>
        )
    }

    async function getUpcommingInterviews() {
        try {
            const res = await axiosClient.get('/upcomming-interviews')
            const newInterviews = await Promise.all(res.data.data.map(async interview => {
                const imgRes = await getUserPicture(interview.user_pic)
                return { ...interview, user_pic: imgRes }
            }))
            console.log(newInterviews);
            setUpcommingInterviews(newInterviews)
        } catch (error) {
            console.log(error)
        }
    }
    function displayUpcommingInterviews() {
        return upcommingInterviews.map(interview =>
            <div key={'i_' + interview.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={interview.user_pic} alt={interview.user_name} />
                        <AvatarFallback>{interview.user_name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-semibold">{interview.user_name}</h4>
                        <p className="text-sm text-gray-500">
                            {interview.day} from {interview.start_time.slice(0, -3)} to {interview.end_time.slice(0, -3)}
                        </p>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <CompanyPaddedContent>
            <div className="p-1">
                <h1 className="text-xl font-medium mt-4 capitalize">Hi {user.first_name},</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-lg font-semibold">Upcomming interviews</h2>
                                <Link to={COMPANY_INTERVIEW} className="text-sm text-blue-600">
                                    All interviews →
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {displayUpcommingInterviews()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                                <h2 className="text-lg font-semibold">Job offer stats for the last year</h2>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <div className="bg-[#2563eb] w-2 h-2 rounded-full"></div>
                                    <p className="text-sm text-gray-600">Job offers</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="bg-[#EED202] w-2 h-2 rounded-full"></div>
                                    <p className="text-sm text-gray-600">Applies</p>
                                </div>
                            </div>
                            <CurvedlineChart className="w-full h-[300px]" />
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <Card className="col-span-1 md:col-span-2">
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Latest applies</h2>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {displayLatestApplies()}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CompanyPaddedContent>
    )
}


function CurvedlineChart(props) {
    const [joData, setJOData] = useState([])
    const [aData, setAData] = useState([])
    useEffect(() => {
        async function getStats() {
            try {
                let res = await axiosClient.get('/job-offers-stats')
                setJOData(res.data.data)

                res = await axiosClient.get('/applies-stats')
                setAData(res.data.data)
            } catch (error) {
                console.log("dashboard", error)
            }
        }
        getStats()
    }, [])
    return (
        <div {...props}>
            <ResponsiveLineCanvas
                data={[
                    {
                        id: "jo",
                        data: joData,
                    },
                    {
                        id: "a",
                        data: aData,
                    },
                ]}
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                xScale={{
                    type: "point",
                }}
                yScale={{
                    type: "linear",
                    min: 0,
                    max: "auto",
                }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 16,
                }}
                axisLeft={{
                    tickSize: 0,
                    tickValues: 5,
                    tickPadding: 16,
                }}
                colors={["#2563eb", "#EED202"]}
                pointSize={6}
                useMesh={true}
                gridYValues={6}
                theme={{
                    tooltip: {
                        chip: {
                            borderRadius: "9999px",
                        },
                        container: {
                            fontSize: "12px",
                            textTransform: "capitalize",
                            borderRadius: "6px",
                        },
                    },
                    grid: {
                        line: {
                            stroke: "#f3f4f6",
                        },
                    },
                }}
                role="application"
            />
        </div>
    )
}

function TrendingUpIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}
