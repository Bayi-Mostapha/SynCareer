import { Separator } from "../ui/separator";

function Stepper({ formStep }) {
    const current = 'border-primary'
    const passed = 'border-primary bg-primary'

    return (
        <div className="flex items-center gap-2">
            <div
                className={`w-2 h-2 rounded-full border ${formStep > 0 ? passed : formStep === 0 ? current : 'border-gray-300 bg-gray-300'}`}
            ></div>
            <Separator className={`flex-1 ${formStep >= 1 && 'bg-primary'}`} />
            <div
                className={`w-2 h-2 rounded-full border ${formStep > 1 ? passed : formStep === 1 ? current : 'border-gray-300 bg-gray-300'}`}
            ></div>
            <Separator className={`flex-1 ${formStep === 2 && 'bg-primary'}`} />
            <div
                className={`w-2 h-2 rounded-full border ${formStep > 2 ? passed : formStep === 2 ? current : 'border-gray-300 bg-gray-300'}`}
            ></div>
        </div>
    );
}

export default Stepper;
