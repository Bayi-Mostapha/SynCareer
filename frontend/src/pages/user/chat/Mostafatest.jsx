import { axiosClient } from '@/api/axios';
import { Input } from '@/components/ui/input';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';

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
function Mtest() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState(''); //bad practice
    useEffect(() => {
        window.Echo.private('private.1').listen('.chat', (e) => {
            setMessages(prev => {
                return [...prev, { message: e.message, user: e.userName }]
            });
        })
    }, [])

    const handleClick = async () => {
        try {
            await axiosClient.post('/sedddd', { message: inputValue });
        } catch (error) {
            console.log(error);
        } finally {
            setInputValue("");
        }

    };

    return (
        <div>
            {messages?.map((message, index) => {
                return (
                    <div key={index}>
                        <p className='text-primary'>{message.user}:</p>
                        <p>{message.message}</p>
                    </div>
                );
            })}
            {/* the input is a temporary bad practice */}
            {/* use shadcn form with react hook form and yup for validation (check login) */}
            <Input
                className='mt-20'
                type="text"
                value={inputValue}
                placeholder="message"
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={handleClick}>send</button>
        </div>
    );
}

export default Mtest;