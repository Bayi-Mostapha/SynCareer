import SynCareerLoader from "@/components/general/syncareer-loader";

function SynCareerLoadingPage() {
    return (
        <div className="w-screen h-screen bg-background flex justify-center items-center">
            <SynCareerLoader />
        </div>
    );
}

export default SynCareerLoadingPage;