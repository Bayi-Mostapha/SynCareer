import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

function ResumeSummary({ formData, handleChange, handleTitleChange, titles, titleStyles, isEdit }) {
    return (
        <div style={{ marginBottom: '15px' }}>
            <input
                readOnly={!isEdit}
                type="text"
                value={titles.summary}
                name="summary"
                onChange={handleTitleChange}
                style={titleStyles}
            />
            {
                isEdit ?
                    <Dialog>
                        <DialogTrigger style={{ fontFamily: 'sans-serif' }} className="w-full text-left">{formData.personalSummary}</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{titles.summary}</DialogTitle>
                                <DialogDescription>You can close this pop up after you are done!</DialogDescription>
                                <Textarea
                                    value={formData.personalSummary}
                                    name="personalSummary"
                                    onChange={handleChange}
                                />
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    :
                    <div style={{ fontFamily: 'sans-serif' }}>
                        {formData.personalSummary}
                    </div>
            }
        </div>
    );
}

export default ResumeSummary;