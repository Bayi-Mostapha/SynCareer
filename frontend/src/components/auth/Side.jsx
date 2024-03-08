import { useEffect, useState } from "react";

// icons 
import { FaStar } from "react-icons/fa";

// shadcn 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"

function Side() {
    const [api, setApi] = useState()
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
            
        })
    }, [api])
    return (
        <div className="px-10 pt-12 hidden lg:flex flex-col w-2/5 h-full bg-primary">
            <h1 className="font-medium text-white text-xl">SynCareer</h1>
            <div className="flex-1 my-16">
                <h2 className="mb-8 font-medium text-white text-4xl leading-normal">Start your journey with us</h2>
                <p className="font-extralight text-white text-sm">Lorem ipsum dolor sit amet consectetur. Feugiat odio varius placerat posuere feugiat. Ameet neque quam purus volutpat ornarecelerisque </p>
            </div>
            <Carousel
                className="w-full max-w-xs hover:cursor-grab active:cursor-grabbing"
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent>
                    <CarouselItem key={1}>
                        <div className="p-5 bg-[#004CDF] text-background rounded-xl">
                            <p className="text-xs mb-3">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat dolorem, unde sed soluta amet voluptate. Libero, corrupti cum reiciendis.</p>
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p>Mostapha</p>
                                    <p className="text-xs text-[#DAEAFF]">senior full stack engineer</p>
                                </div>
                                <div className="flex gap-1 text-xs text-[#E8FF1D]">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
            <div className="py-3 flex items-center justify-center gap-1">
                <div className={`h-1.5 w-1.5 rounded-full ${current === 1 ? 'bg-background' : 'bg-primary border border-background'}`}></div>
                <div className={`h-1.5 w-1.5 rounded-full ${current === 2 ? 'bg-background' : 'bg-primary border border-background'}`}></div>
                <div className={`h-1.5 w-1.5 rounded-full ${current === 3 ? 'bg-background' : 'bg-primary border border-background'}`}></div>
            </div>
        </div>
    );
}

export default Side;