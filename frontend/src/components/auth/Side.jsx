import MyCarousel from "./MyCarousel";

function Side() {

    const testimonials = [
        {
            text: "Lorem ipsum dolor sit amet consectetur. Feugiat odio varius placerat posuere feugiat. Ameet neque quam purus volutpat ornarecelerisque ",
            name: "Mostapha",
            position: "full stack enginner",
            image: "https://source.unsplash.com/featured/300x201",
            nStarts: 5
        },
        {
            text: "Lorem ipsum dolor sit amet consectetur. Feugiat odio varius placerat posuere feugiat. Ameet neque quam purus volutpat ornarecelerisque ",
            name: "reda",
            position: "full stack enginner",
            image: "https://source.unsplash.com/featured/300x202",
            nStarts: 5
        },
        {
            text: "Lorem ipsum dolor sit amet consectetur. Feugiat odio varius placerat posuere feugiat. Ameet neque quam purus volutpat ornarecelerisque ",
            name: "abdelhakim",
            position: "full stack enginner",
            image: "https://source.unsplash.com/featured/300x203",
            nStarts: 5
        },
    ];

    return (
        <div className="px-10 pt-12 hidden lg:flex flex-col w-2/5 h-full bg-primary">
            <h1 className="font-medium text-white text-xl">SynCareer</h1>
            <div className="flex-1 my-16">
                <h2 className="mb-8 font-medium text-white text-4xl leading-normal">Start your journey with us</h2>
                <p className="font-extralight text-white text-sm">Lorem ipsum dolor sit amet consectetur. Feugiat odio varius placerat posuere feugiat. Ameet neque quam purus volutpat ornarecelerisque </p>
            </div>
            <MyCarousel testimonials={testimonials} />
        </div>
    );
}

export default Side;