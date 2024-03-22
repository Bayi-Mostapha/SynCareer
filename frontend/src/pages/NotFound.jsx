import { LOGIN_LINK } from "@/router";
import { Link } from "react-router-dom";
import QuestionsAmico from '@/assets/QuestionsAmico.svg'
import { Button } from "@/components/ui/button";

function NotFound() {
    return (
        <div className="py-10 h-screen w-screen flex flex-col justify-around items-center">
            <h1 className="font-semibold text-primary">SynCareer</h1>
            <div className="flex-1 flex flex-col items-center">
                <h2 className="text-7xl text-primary">404</h2>
                <img className="w-96" src={QuestionsAmico} alt="" />
                <p className="text-gray-500">the page that you are looking for does not exist</p>
            </div>
            <Button variant="default">
                <Link to={LOGIN_LINK}>go home</Link>
            </Button>
        </div>
    );
}

export default NotFound;