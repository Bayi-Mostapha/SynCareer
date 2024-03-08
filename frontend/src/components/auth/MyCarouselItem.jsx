// icons 
import { FaStar } from "react-icons/fa";

// shadcn 
import {
    CarouselItem,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function MyCarouselItem({ text, image, name, position, nStarts }) {
    return (
        <CarouselItem>
            <div className="p-5 bg-[#004CDF] text-background rounded-xl">
                <p className="text-xs mb-3">{text}</p>
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p>{name}</p>
                        <p className="text-xs text-[#DAEAFF] uppercase">{position}</p>
                    </div>
                    <div className="flex gap-1 text-xs text-[#E8FF1D]">
                        {[...Array(nStarts)].map((_, index) => (
                            <FaStar key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </CarouselItem>
    );
}

export default MyCarouselItem;