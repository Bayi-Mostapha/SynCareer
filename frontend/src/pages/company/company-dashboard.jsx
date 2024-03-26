// shadcn 
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"

// nivo
import { ResponsiveLineCanvas } from "@nivo/line"

export default function CompanyDashboard() {
    return (
        <div className="p-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Revenues</h2>
                            <a className="text-sm text-blue-600" href="#">
                                →
                            </a>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline space-x-2">
                            <h3 className="text-4xl font-bold text-green-600">15%</h3>
                            <TrendingUpIcon className="text-green-600" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-500">Increase compared to last week</p>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Lost deals</h2>
                            <a className="text-sm text-blue-600" href="#">
                                →
                            </a>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline space-x-2">
                            <h3 className="text-4xl font-bold text-red-600">4%</h3>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-500">You closed 96 out of 100 deals</p>
                    </CardFooter>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                            <h2 className="text-lg font-semibold">Interviewed</h2>
                            <Select>
                                <SelectTrigger className="w-fit">
                                    <SelectValue placeholder="Sort by Newest" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">Chris Fiedkicky</h4>
                                    <p className="text-sm text-gray-500">Supermarket Wiktorska</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">Maggie Johnson</h4>
                                    <p className="text-sm text-gray-500">Oasis Organic Inc.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">Gael Harry</h4>
                                    <p className="text-sm text-gray-500">New York Fruits</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">Jenna Sullivan</h4>
                                    <p className="text-sm text-gray-500">Walmart</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <a className="text-sm text-blue-600 mt-4 block" href="#">
                            All candidats →
                        </a>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                            <h2 className="text-lg font-semibold">Growth</h2>
                            <Select>
                                <SelectTrigger className="w-fit">
                                    <SelectValue placeholder="Yearly" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CurvedlineChart className="w-full h-[300px]" />
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Chats</h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Avatar>
                                    <AvatarImage alt="User 1" src="/placeholder.svg?height=40&width=40" />
                                    <AvatarFallback>U1</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 ml-4">
                                    <p className="text-sm font-medium truncate">Fruit2Go</p>
                                    <p className="text-sm text-gray-500 truncate">Latest: How about an order of 20 boxes?</p>
                                </div>
                                <Badge variant="secondary">1</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <Avatar>
                                    <AvatarImage alt="User 2" src="/placeholder.svg?height=40&width=40" />
                                    <AvatarFallback>U2</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 ml-4">
                                    <p className="text-sm font-medium truncate">Marshall's MKT</p>
                                    <p className="text-sm text-gray-500 truncate">Latest: Thanks for the quick delivery!</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <a className="text-sm text-blue-600 mt-4 block" href="#">
                            All messages →
                        </a>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold mb-4">New job offers</h2>

                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Button variant="ghost">Fruit2Go</Button>
                            <Button variant="ghost">Marshall's MKT</Button>
                            <Button variant="ghost">CCNT</Button>
                            <Button variant="ghost">Joana Mini-market</Button>
                            <Button variant="ghost">Little Brazil Vegan</Button>
                            <Button variant="ghost">Target</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


function CurvedlineChart(props) {
    return (
        <div {...props}>
            <ResponsiveLineCanvas
                data={[
                    {
                        id: "Desktop",
                        data: [
                            { x: "Jan", y: 43 },
                            { x: "Feb", y: 137 },
                            { x: "Mar", y: 61 },
                            { x: "Apr", y: 145 },
                            { x: "May", y: 26 },
                            { x: "Jun", y: 154 },
                        ],
                    },
                    {
                        id: "Mobile",
                        data: [
                            { x: "Jan", y: 60 },
                            { x: "Feb", y: 48 },
                            { x: "Mar", y: 177 },
                            { x: "Apr", y: 78 },
                            { x: "May", y: 96 },
                            { x: "Jun", y: 204 },
                        ],
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
                colors={["#2563eb", "#e11d48"]}
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
