// icons 
import { FaRegTrashCan, FaPlus } from "react-icons/fa6";
import { TbCalendarTime } from "react-icons/tb";
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
import { ScrollArea } from "@/components/ui/scroll-area"

function ResumeCard({ resume, onDelete, onDownload }) {

    return (
        <div>
            <div className="p-1 pr-0 flex justify-between items-end">
                <div className="flex-1">
                    <h2 className="font-semibold">#{resume.id}</h2>
                    <p className="text-xs text-slate-600">Created: {resume.date}</p>
                </div>
                <div className="flex gap-1 mb-2">
                    <Dialog>
                        <DialogTrigger>
                            <FaRegTrashCan className="text-red-500 hover:opacity-80 active:opacity-70" />
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
                    <Button
                        disabled={resume.isDeleting || resume.isDownloading}
                        onClick={() => { onDownload(resume.resume_name, resume.id) }}
                        variant="ghost"
                        className="p-0 hover:opacity-80 active:opacity-70"
                    >
                        <MdOutlineFileDownload className="text-xl text-slate-700" />
                    </Button>
                </div>
            </div>
            <ScrollArea className="h-[240px] rounded-md border">
                <img className="object-cover" src={resume.img} alt={resume.id} />
            </ScrollArea>
        </div>
    );
}

export default ResumeCard;