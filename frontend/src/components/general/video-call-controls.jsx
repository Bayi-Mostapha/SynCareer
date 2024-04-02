import { Button } from '@/components/ui/button';
import { ImPhoneHangUp } from "react-icons/im";
import { CiVideoOn } from "react-icons/ci";
import { CiVideoOff } from "react-icons/ci";
import { CiMicrophoneOn } from "react-icons/ci";
import { CiMicrophoneOff } from "react-icons/ci";

function VideoCallControlls({ showVid, showAudio, onCam, onMic, onHangUp, condition }) {
    function displayVidIcon() {
        if (showVid) {
            return <CiVideoOn />;
        }
        else {
            return <CiVideoOff />;
        }
    }
    function displayAudioIcon() {
        if (showAudio) {
            return <CiMicrophoneOn />;
        }
        else {
            return <CiMicrophoneOff />;
        }
    }
    return (
        <div className="mt-6 flex justify-center items-center gap-4">
            <Button
                className={`w-12 h-12 p-0 text-2xl rounded-full ${showVid ? 'bg-background' : 'bg-gray-200  hover:bg-gray-200'} flex justify-center items-center shadow-md`}
                variant="ghost"
                onClick={onCam}
            >
                {displayVidIcon()}
            </Button>
            <Button
                className={`w-12 h-12 p-0 text-2xl rounded-full ${showAudio ? 'bg-background' : 'bg-gray-200  hover:bg-gray-200'} flex justify-center items-center shadow-md`}
                variant="outline"
                onClick={onMic}
            >
                {displayAudioIcon()}
            </Button>
            {
                condition &&
                <Button
                    className='w-12 h-12 p-0 text-2xl rounded-full flex justify-center items-center shadow-md'
                    variant="destructive"
                    onClick={onHangUp}
                >
                    <ImPhoneHangUp />
                </Button>
            }
        </div>
    );
}

export default VideoCallControlls;