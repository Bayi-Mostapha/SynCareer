import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LOGIN_LINK, REGISTER_LINK } from "@/router";

function LandingPage() {
    const navigate = useNavigate()
    return (
        <>
            <div
                style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                }}
                className="fixed top-0 left-0 right-0 p-2 flex justify-between">
                <h1 className="text-xl text-primary font-semibold">SynCareer</h1>
                <div className="flex gap-2">
                    <Button onClick={() => { navigate(REGISTER_LINK) }} variant='outline'>Sign Up</Button>
                    <Button onClick={() => { navigate(LOGIN_LINK) }}>Login</Button>
                </div>
            </div>

            <div
                style={{
                    backgroundImage: 'url("../../public/header-pic.png")',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    height: '800px'
                }}
                className="px-20 grid items-center justify-center grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="w-full lg:w-[400px]">
                    <h2 className="text-2xl font-bold flex flex-col">
                        <span className="text-primary">The Smarter Way to get</span>
                        <span className="text-[#002E5B]">your dream job</span>
                    </h2>
                    <p className="my-3">
                        SynCareer helps you 10x your chances of getting your dream job while
                        increasing your lifetime salary by $200,000 and more.
                    </p>
                    <div className="flex gap-2">
                        <Button onClick={() => { navigate(REGISTER_LINK) }} variant='outline'>Sign Up</Button>
                        <Button onClick={() => { navigate(LOGIN_LINK) }}>Login</Button>
                    </div>
                </div>
            </div>

            <div className="my-20">
                <Carousel
                    className="mx-auto px-20 py-5 w-[90%] lg:w-[70%] bg-[#F8FAFB] rounded-lg"
                >
                    <h3 className="py-1 px-5 mx-auto text-primary font-medium border border-primary rounded-full w-fit">Testimonials</h3>
                    <h4 className="mt-4 text-4xl font-semibold text-center capitalize">Our customer's says</h4>
                    <p className="mx-auto mt-2 mb-10 w-full lg:w-96 text-center text-gray-500">
                        Lorem ipsum dolor sit amet consectetur. Nunc turpis non arcu volutpat nisl sit erat ontes tufas consectetur.
                    </p>
                    <CarouselContent className="-ml-2 cursor-grab active:cursor-grabbing">
                        <CarouselItem className="lg:basis-1/2 pl-2 pr-2">
                            <div className="p-6 bg-background rounded-xl border border-gray-200 shadow-md">
                                <p className="text-sm mb-5">
                                    Lorem ipsum dolor sit amet consectetur. Nunc turpis non arcu volutpat nisl sit erat ontes tufas consectetur.
                                </p>
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage className="rounded-full" src="https://randomuser.me/api/portraits/med/women/65.jpg" />
                                        <AvatarFallback>IMG</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="capitalize">Jhon Doe</p>
                                        <p className="text-xs capitalize">Software engineer</p>
                                    </div>
                                    <div className="ml-auto flex gap-1 text-xs text-[#FF8A00]">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar key={index} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem className="lg:basis-1/2">
                            <div className="p-6 bg-background rounded-xl border border-gray-200 shadow-md">
                                <p className="text-sm mb-5">
                                    Lorem ipsum dolor sit amet consectetur. Nunc turpis non arcu volutpat nisl sit erat ontes tufas consectetur.
                                </p>
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage className="rounded-full" src="https://randomuser.me/api/portraits/med/men/10.jpg" />
                                        <AvatarFallback>IMG</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="capitalize">Jhon Doe</p>
                                        <p className="text-xs capitalize">Software engineer</p>
                                    </div>
                                    <div className="ml-auto flex gap-1 text-xs text-[#FF8A00]">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar key={index} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem className="lg:basis-1/2">
                            <div className="p-6 bg-background rounded-xl border border-gray-200 shadow-md">
                                <p className="text-sm mb-5">
                                    Lorem ipsum dolor sit amet consectetur. Nunc turpis non arcu volutpat nisl sit erat ontes tufas consectetur.
                                </p>
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage className="rounded-full" src="https://randomuser.me/api/portraits/med/women/76.jpg" />
                                        <AvatarFallback>IMG</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="capitalize">Jhon Doe</p>
                                        <p className="text-xs capitalize">Software engineer</p>
                                    </div>
                                    <div className="ml-auto flex gap-1 text-xs text-[#FF8A00]">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar key={index} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </div>

            <h3 className="py-1 px-5 mx-auto text-primary font-medium border border-primary rounded-full w-fit">FAQS</h3>
            <h4 className="mt-8 mb-16 text-4xl font-semibold text-center capitalize">Frequently asked question</h4>
            <Accordion className="mb-20 w-96 mx-auto" type="single" collapsible>
                <AccordionItem className="my-4 px-3 border border-gray-100 shadow-sm rounded-lg" value="item-1">
                    <AccordionTrigger>How many jobs can I post?</AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem className="my-4 px-3 border border-gray-100 shadow-sm rounded-lg" value="item-2">
                    <AccordionTrigger>Why is recruitment important?</AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem className="my-4 px-3 border border-gray-100 shadow-sm rounded-lg" value="item-3">
                    <AccordionTrigger>How do i get applications?</AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem className="my-4 px-3 border border-gray-100 shadow-sm rounded-lg" value="item-4">
                    <AccordionTrigger>How many jobs can i apply to?</AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <footer className="py-6 px-3 bg-primary text-white">
                <div>
                    <h2 className="text-xl font-semibold">SynCareer</h2>
                    <p className="w-full lg:w-96 my-8">
                        Open source is source code that is made freely available for possible modification and redistribution. Products include permission to use the source code, design documents, or content of the product.
                    </p>
                    <img src="../../public/social icons.png" alt="" />
                </div>
            </footer>
        </>
    );
}

export default LandingPage;