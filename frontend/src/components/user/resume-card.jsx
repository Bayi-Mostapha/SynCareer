// icons 
import { FaRegTrashCan, FaPlus } from "react-icons/fa6";
import { TbPencil, TbCalendarTime } from "react-icons/tb";
import { MdOutlineFileDownload } from "react-icons/md";
// shadcn 
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"

function ResumeCard({ resume, onDelete, onDownload }) {
    function formatDateTime(string) {
        const dateObj = new Date(string);

        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = dateObj.toLocaleDateString('en-GB', options);

        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;

        return [date, time];
    }

    const [date, time] = formatDateTime(resume.created_at)

    return (
        <div className="p-4 bg-background rounded-md shadow-md">
            <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">#{resume.id}</p>
                <div className="flex items-center gap-1">
                    {/* <Link
                                to={`${resume.id}`}
                                className="p-0 text-xl bg-transparent text-primary hover:bg-transparent hover:opacity-80 hover:text-primary active:opacity-70 transition-all"
                            >
                                <TbPencil />
                            </Link> */}
                    <Dialog>
                        <DialogTrigger>
                            <FaRegTrashCan className="text-destructive hover:opacity-80 active:opacity-70" />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure you want to delete this resume?</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>Note: You wont be able to restore it once you delete it</DialogDescription>
                            <DialogFooter className="ml-auto w-fit flex items-center gap-3">
                                <DialogClose>Cancel</DialogClose>
                                <Button
                                    disabled={resume.isDeleting || resume.isDownloading}
                                    onClick={() => { onDelete(resume.id) }}
                                    variant="destructive"
                                >
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <p className="my-1 text-xs text-gray-500 flex items-center gap-1"><TbCalendarTime className="text-sm" /> {date} {time}</p>
            <img className="border border-1 bg-gray-400" src={`http://localhost:8000/api/storage/resume-images/${resume.image_name}`} alt={resume.id} />
            <Button
                disabled={resume.isDeleting || resume.isDownloading}
                onClick={() => { onDownload(resume.resume_name, resume.id) }}
                variant="default"
                className="mt-2 w-full flex items-center gap-1"
            >
                <MdOutlineFileDownload className="text-xl" /> Download
            </Button>
        </div>
    );
}

export default ResumeCard;