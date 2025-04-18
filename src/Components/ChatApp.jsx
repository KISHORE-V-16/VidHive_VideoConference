import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ChatApp = ({pc , chatChannel, onNewMessage }) => {
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [inputMessage, setInputMessage] = useState(''); // State for the input message

  pc.ondatachannel = (event) => {
    const channel = event.channel;
  
    if (channel.label === "chat") {
      // Handle chat messages
      channel.onmessage = (msgEvent) => {
        const message = msgEvent.data;
        console.log(message,"remote from chat channel");
        setMessages((prevMessages) => [...prevMessages, { text: message, isLocal: false }]);
        onNewMessage(); // Notify parent component of a new message
      };
    } 
  }
  // Handle incoming messages
  useEffect(() => {
    if (!chatChannel) return;

    const handleMessage = (event) => {
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, { text: message, isLocal: false }]);
      onNewMessage(); // Notify parent component of a new message
    };

    chatChannel.onmessage = handleMessage;

    return () => {
      chatChannel.onmessage = null; // Cleanup
    };
  }, [chatChannel, onNewMessage]);

  // Function to send a chat message
  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      chatChannel.send(inputMessage);
      setMessages((prevMessages) => [...prevMessages, { text: inputMessage, isLocal: true }]);
      setInputMessage('');
    }
  };

  return (
    <ChatContainer>
      {/* Header */}
      <Header>
        <Title>Chat Room</Title>
        <Status>Online</Status>
      </Header>

      {/* Message List */}
      <MessageList>
        {messages.map((message, index) => (
          <Message key={index} isLocal={message.isLocal}>
            <Text>{message.text}</Text>
            <Timestamp>{new Date().toLocaleTimeString()}</Timestamp>
          </Message>
        ))}
      </MessageList>

      {/* Input Area */}
      <InputArea>
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatApp;

// Styled Components (unchanged)
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 25rem;
  background: linear-gradient(135deg, #0a192f, #1a365d);
  color: white;
  font-family: 'Arial', sans-serif;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #1a365d, #0a192f);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #64ffda;
`;

const Status = styled.span`
  font-size: 0.9rem;
  color: #64ffda;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  background: rgba(100, 255, 218, 0.1);
`;

const MessageList = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  scrollbar-width: none;
  background: rgba(255, 255, 255, 0.05);
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isLocal }) => (isLocal ? 'flex-end' : 'flex-start')};
  margin-bottom: 1rem;
`;

const Text = styled.div`
  max-width: 70%;
  padding: 0.8rem 1rem;
  border-radius: ${({ isLocal }) => (isLocal ? '15px 15px 0 15px' : '15px 15px 15px 0')};
  background: ${({ isLocal }) => (isLocal ? '#64ffda' : '#1a365d')};
  color: ${({ isLocal }) => (isLocal ? '#0a192f' : 'white')};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.3rem;
`;

const InputArea = styled.div`
  display: flex;
  padding: 1rem;
  background: linear-gradient(135deg, #1a365d, #0a192f);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  outline: none;
  margin-right: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 15px;
  background: #64ffda;
  color: #0a192f;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #52e0c4;
  }
`;