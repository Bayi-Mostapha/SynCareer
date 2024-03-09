import { useEffect, useState } from "react";

// shadcn 
import {
    Carousel,
    CarouselContent,
} from "@/components/ui/carousel"
import MyCarouselItem from "./MyCarouselItem";

function MyCarousel({ testimonials }) {
    const [api, setApi] = useState()
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())

        })
    }, [api])
    return (
        <>
            <Carousel
                className="w-full max-w-xs hover:cursor-grab active:cursor-grabbing"
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent>
                    {testimonials.map((item, index) => (
                        <MyCarouselItem key={index} {...item} />
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="py-3 flex items-center justify-center gap-1">
                {[...Array(testimonials.length)].map((_, index) => (
                    <div key={index} className={`h-1.5 w-1.5 rounded-full ${current === index ? 'bg-background' : 'bg-primary border border-background'}`}></div>
                ))}
            </div>
        </>
    );
}

export default MyCarousel;