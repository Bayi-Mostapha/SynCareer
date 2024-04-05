import { useContext, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import Echo from 'laravel-echo';
import { authContext } from '@/contexts/AuthWrapper';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import VideoCallControlls from '@/components/general/video-call-controls';
import { COMPANY_DASHBOARD_LINK } from '@/router';
import { CiMicrophoneOff } from "react-icons/ci";
import getUserPicture from '@/functions/get-user-pic';

const CompanyVideoCall = () => {
    const { token } = useParams()
    const navigate = useNavigate();
    const { user } = useContext(authContext)
    const channel = window.Echo.join('video.channel.' + token);

    const [showVid, setShowVid] = useState(true);
    const [showAudio, setShowAudio] = useState(true);
    const [users, setUsers] = useState([]);
    const [otherUser, setOtherUser] = useState(null)
    const [myStream, setMyStream] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const [callAnswered, setCallAnswered] = useState(false);
    const [uCam, setUCam] = useState(true)
    const [uMic, setUMic] = useState(true)

    const peerRef = useRef(null);
    const myVideo = useRef();
    const userVideo = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                myVideo.current.srcObject = currentStream;
                setMyStream(currentStream);
            });

        setupPusher();

        channel.here(async users => {
            setUsers(users);
            console.log(users)
            if (users.length > 1) {
                const u = users.filter(u => u.type !== 'company')[0]
                let picture = await getUserPicture(u.picture)
                setOtherUser({ ...u, picture })
            }
        })
            .joining(async u => {
                setUsers(prev => [...prev, u])
                let picture = await getUserPicture(u.picture)
                setOtherUser({ ...u, picture })
            })
            .leaving(user => {
                setIsCalling(false)
                setOtherUser(null)
                setUsers(prev => prev.filter(u => u.type !== 'company'))
                if (callAnswered) {
                    userVideo.current.srcObject = null
                    setCallAnswered(false)
                    window.location.reload()
                }
            })

        channel.listenForWhisper('user-mic-toggle', (e) => {
            setUMic(e.state)
        })
        channel.listenForWhisper('user-cam-toggle', (e) => {
            setUCam(e.state)
        })

        return () => {
            channel.whisper('company-hanged-up', {
                data: 'Call ended by ' + user.name
            })
            channel.unsubscribe();
            if (peerRef.current) {
                peerRef.current.destroy()
            }
            if (myStream) {
                myStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
            peerRef.current = null
            setUsers([]);
            setOtherUser(null)
            setMyStream(null);
            setIsCalling(false);
            setCallAnswered(false);
        }
    }, []);
    useEffect(() => {
        console.log(otherUser)
        if (otherUser) {
            channel.whisper('company-cam-toggle', {
                state: showVid,
            })
            channel.whisper('company-mic-toggle', {
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

    const callUser = () => {
        setIsCalling(true)

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: myStream
        });

        peerRef.current = peer;

        peer.on('signal', (data) => {
            channel.whisper('call-user', {
                type: data.type,
                sdp: data.sdp,
            })
        });

        peer.on('stream', (currentStream) => {
            setCallAnswered(true)
            userVideo.current.srcObject = currentStream;
        });

        channel.listenForWhisper('user-answered', (e) => {
            setCallAnswered(true)
            peer.signal({ type: e.type, sdp: e.sdp });
        })

        channel.listenForWhisper('user-hanged-up', (e) => {
            toast.info(e.data, {
                position: 'top-right'
            })
            channel.unsubscribe()
            setOtherUser(null)
            setIsCalling(false)
            setCallAnswered(false)
            peer.destroy()
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
        setOtherUser(null)
        channel.whisper('company-hanged-up', {
            data: 'Call ended by ' + user.name
        })
        channel.unsubscribe()
        setCallAnswered(false)
        setOtherUser(null)
        peerRef.current.destroy()
        myStream.getTracks().forEach(track => {
            track.stop();
        });
        setMyStream(null)
        navigate(COMPANY_DASHBOARD_LINK)
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
                            <video className={`${(callAnswered && otherUser) ? 'rounded-sm' : 'w-0 h-0 opacity-0'}`} playsInline ref={userVideo} autoPlay></video>
                            {
                                callAnswered && otherUser && otherUser.first_name &&
                                <p className='absolute bottom-3 left-4 py-1 px-3 rounded text-sm text-white bg-black bg-opacity-40'>
                                    {otherUser.first_name}
                                </p>
                            }
                            {
                                callAnswered && (
                                    uMic ?
                                        ''
                                        :
                                        <CiMicrophoneOff className='w-10 h-10 p-2 absolute bottom-3 right-3 rounded-full text-white bg-black bg-opacity-40' />
                                )
                            }
                            {
                                callAnswered && !uCam &&
                                <img className='object-cover w-44 h-44 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' src={otherUser.picture} alt="" />
                            }
                        </div>
                        {
                            !otherUser &&
                            'Waiting for user to join..'
                        }
                        {
                            !callAnswered &&
                            <Button
                                disabled={Object.keys(user).length === 0 || !otherUser || isCalling}
                                onClick={callUser}
                            >
                                {isCalling ? 'Connecting...' : 'Start Call'}
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

export default CompanyVideoCall;