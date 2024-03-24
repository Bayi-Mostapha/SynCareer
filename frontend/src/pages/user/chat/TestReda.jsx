
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const TestReda = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/send-message33', {
        
      });

      console.log('wsl');
      

    } catch (error) {
      console.error('Error sending message:', error);

      setSuccessMessage(null);
      setErrorMessage('Error sending message. Please try again.');
    }
  };

  useEffect(() => {
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'Syncareer_key',
      wsHost: window.location.hostname,
      wsPort: 6001,
      transports: ['websocket'],
      enabledTransports: ['ws', 'wss'],
      forceTLS: false,
      cluster: 'mt1',
    });
  
    const channel = window.Echo.channel('reda');
  
    channel.listen('.redachannel', (event) => {
      console.log('wsleee');
  
      // Use functional update to ensure you are working with the latest state
    });
  
    return () => {
      channel.stopListening('.redachannel');
    };
  }, []); // Empty dependency array to run the effect only once
  
  return (
    <div>
      <h1>Message Form</h1>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TestReda;
