import { useContext, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import Echo from 'laravel-echo';
import { authContext } from '@/contexts/AuthWrapper';
import { Button } from '@/components/ui/button';
import { USER_HOME_LINK } from '@/router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import VideoCallControlls from '@/components/general/video-call-controls';
import { CiMicrophoneOff } from "react-icons/ci";
import getUserPicture from '@/functions/get-user-pic';

const UserVideoCall = () => {
    const navigate = useNavigate();
    const { user } = useContext(authContext)
    const channel = window.Echo.join('video.channel');

    const [showVid, setShowVid] = useState(true);
    const [showAudio, setShowAudio] = useState(true);
    const [users, setUsers] = useState([]);
    const [otherUser, setOtherUser] = useState(null)
    const [myStream, setMyStream] = useState(null);
    const [call, setCall] = useState({})
    const [answering, setAnswering] = useState(false)
    const [callAnswered, setCallAnswered] = useState(false)
    const [cCam, setCCam] = useState(true)
    const [cMic, setCMic] = useState(true)

    const peerRef = useRef(null);
    const myVideo = useRef();
    const userVideo = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                myVideo.current.srcObject = currentStream;
                setMyStream(currentStream)
            });

        setupPusher();

        channel.here(async users => {
            setUsers(users);
            const u = users.filter(u => u.type !== 'user')[0]
            let picture = await getUserPicture(u.picture)
            setOtherUser({ ...u, picture })
        })
            .joining(async u => {
                setUsers(prev => [...prev, u])
                let picture = await getUserPicture(u.picture)
                setOtherUser({ ...u, picture })
            })
            .leaving(user => {
                setUsers(prev => prev.filter(u => u.type !== 'user'))
                setCall({})
                setOtherUser(null)
                if (callAnswered) {
                    userVideo.current.srcObject = null
                    setCallAnswered(false)
                    window.location.reload()
                }
            })

        channel.listenForWhisper('call-user', (e) => {
            setCall({ isReceivingCall: true, signal: e });
        });
        channel.listenForWhisper('company-mic-toggle', (e) => {
            setCMic(e.state)
        })
        channel.listenForWhisper('company-cam-toggle', (e) => {
            setCCam(e.state)
        })
    }, []);
    useEffect(() => {
        if (otherUser) {
            channel.whisper('user-cam-toggle', {
                state: showVid,
            })
            channel.whisper('user-mic-toggle', {
                state: showAudio,
            })
        }
    }, [otherUser, showAudio, showVid])

    const setupPusher = () => {
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: 'local',
            wsHost: 'localhost',
            wsPort: 6001,
            cluster: "mt1",
            forceTLS: false,
            disableStats: true,
            authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
            auth: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                }
            },
        });
    };

    const answerCall = () => {
        setAnswering(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: myStream
        });

        peerRef.current = peer;

        peer.on('signal', (data) => {
            channel.whisper('user-answered', {
                type: data.type,
                sdp: data.sdp,
            })
        });

        peer.on('stream', (currentStream) => {
            setAnswering(false)
            setCallAnswered(true)
            userVideo.current.srcObject = currentStream;
        });

        peer.signal({ type: call.signal.type, sdp: call.signal.sdp });

        channel.listenForWhisper('company-hanged-up', (e) => {
            toast.info(e.data, {
                position: 'top-right'
            })
            setOtherUser(null)
            setCall({})
            peer.destroy()
            setCallAnswered(false)
            userVideo.current.srcObject = null
            window.location.reload()
        })
    };

    const toggleCam = () => {
        if (callAnswered) {
            const videoSender = peerRef.current._pc.getSenders().find(sender => sender.track.kind === 'video');

            if (videoSender) {
                videoSender.track.enabled = !videoSender.track.enabled;
                setShowVid(videoSender.track.enabled)
            }
        } else {
            let videoTrack = myStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setShowVid(videoTrack.enabled)
        }
    }
    const toggleMic = () => {
        if (callAnswered) {
            const audioSender = peerRef.current._pc.getSenders().find(sender => sender.track.kind === 'audio');

            if (audioSender) {
                audioSender.track.enabled = !audioSender.track.enabled;
                setShowAudio(audioSender.track.enabled);
            }
        } else {
            let audioTrack = myStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setShowAudio(audioTrack.enabled)
        }
    }
    const hangUp = () => {
        channel.whisper('user-hanged-up', {
            data: 'Call ended by ' + user.first_name
        })
        setCall({})
        setOtherUser(null)
        peerRef.current.destroy()
        navigate(USER_HOME_LINK)
    }

    return (
        <div className='py-2 px-4 lg:px-20 bg-bbackground min-h-screen flex flex-col items-center justify-center gap-3'>
            <h1 className='text-primary text-2xl font-semibold'>SynCareer</h1>
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="relative">
                        <video className='rounded-sm' muted playsInline ref={myVideo} autoPlay></video>
                        {
                            Object.keys(user).length !== 0 && user.first_name &&
                            <p className='absolute bottom-3 left-4 py-1 px-3 rounded text-sm text-white bg-black bg-opacity-40'>
                                {user.first_name}
                            </p>
                        }
                        {
                            !showAudio &&
                            <CiMicrophoneOff className='w-10 h-10 p-2 absolute bottom-3 right-3 rounded-full text-white bg-black bg-opacity-40' />
                        }
                        {
                            !showVid &&
                            <img className='object-cover w-44 h-44 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' src={user.picture} alt="" />
                        }
                    </div>
                    <div className={`flex flex-col justify-center items-center`}>
                        <div className='relative'>
                            <video className={`${callAnswered && otherUser ? '' : 'w-0 h-0 opacity-0'}`} playsInline ref={userVideo} autoPlay></video>
                            {
                                callAnswered && otherUser && otherUser.first_name &&
                                <p className='absolute bottom-3 left-4 py-1 px-3 rounded text-sm text-white bg-black bg-opacity-40'>
                                    {otherUser.first_name}
                                </p>
                            }
                            {
                                callAnswered && (
                                    cMic ?
                                        ''
                                        :
                                        <CiMicrophoneOff className='w-10 h-10 p-2 absolute bottom-3 right-3 rounded-full text-white bg-black bg-opacity-40' />
                                )
                            }
                            {
                                callAnswered && !cCam &&
                                <img className='object-cover w-44 h-44 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' src={otherUser.picture} alt="" />
                            }
                        </div>
                        {
                            !callAnswered && !call.isReceivingCall &&
                            'Waiting for recruiter..'
                        }
                        {
                            (!callAnswered && call.isReceivingCall && Object.keys(user).length !== 0) &&
                            <Button disabled={answering} onClick={answerCall}>
                                {
                                    answering ?
                                        'Joining..'
                                        :
                                        'Join'
                                }
                            </Button>
                        }
                    </div>
                </div>
                <VideoCallControlls
                    condition={callAnswered && otherUser}
                    onCam={toggleCam}
                    onMic={toggleMic}
                    onHangUp={hangUp}
                    showAudio={showAudio}
                    showVid={showVid}
                />
            </div>
        </div >
    );
};

export default UserVideoCall;