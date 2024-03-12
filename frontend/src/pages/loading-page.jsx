function SynCareerLoader() {
    return (
        <div className="w-screen h-screen bg-background flex justify-center items-center">
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-jump"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-jump delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-jump delay-200"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-jump delay-300"></div>
            </div>
        </div>
    );
}

export default SynCareerLoader;