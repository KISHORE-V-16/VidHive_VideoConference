// Import necessary libraries
import { useEffect, useRef, useState } from "react";
import { firestore1 } from "../Utils/firebase.jsx";
import { collection, doc, setDoc, getDoc, onSnapshot, addDoc, deleteDoc, getDocs, updateDoc, connectFirestoreEmulator } from "firebase/firestore";
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import HeaderVideo from '../Components/HeaderVideo.jsx';
import FooterVideo from '../Components/FooterVideo.jsx';
import AvatarView from '../Components/AvatarView.jsx';
import { Modal, Button, Group, Avatar, MantineProvider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import 'react-toastify/dist/ReactToastify.css';
import * as faceapi from 'face-api.js';
import Createmeeting from './Createmeeting.jsx';
import JoinMeeting from './JoinMeeting.jsx';
import Mymeetings from './Mymeetings.jsx';
import ChatApp from "../Components/ChatApp.jsx";

const servers = {
    iceServers: [
        {
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ],
        },
    ],
    iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);
const otherChannel = pc.createDataChannel("other");
const chatChannel = pc.createDataChannel("chat");

let remop;
const toaststyles = {
    position: "top-center",
    autoClose: 1300,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: "custom-toast",
}



const Room = () => {

    const loc = useParams();
    const navigator1 = useNavigate();

    const [isVideo, setIsVideo] = useState(true);
    const [isnVideo, setIsnVideo] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isremote, setisremote] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [docdata, setdocdata] = useState([]);
    const [emtdetection, setemtdetection] = useState(false);
    const [avatar, setavatar] = useState(false);
    const [remstream, setremstream] = useState([]);
    const [opened, { open, close }] = useDisclosure(false); // Control modal visibility
    const [avatarSelected, setAvatarSelected] = useState(false); // Track if avatar is selected
    const [emotionDetectionOn, setEmotionDetectionOn] = useState(false);
    const detectionInterval = useRef(null);

    const localRef = useRef();
    const remoteRef = useRef();
    const localStreamRef = useRef();

    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const screenStreamRef = useRef(null);

    const [useAvatar, setUseAvatar] = useState(false);
    const [avatarStream, setAvatarStream] = useState(null);

    const [newMessageCount, setNewMessageCount] = useState(0); // State to track new messages
    const [messages, setMessages] = useState([]); // State to store chat messages
    const [inputMessage, setInputMessage] = useState(''); // State for the input message
    const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat visibility

    // 2. Create function to toggle avatar stream

    const toggleAvatar = async () => {

        if (!useAvatar) {

            // Notify remote peers
            otherChannel.send("avatar-enabled");
            console.log('avatar-1');
            setUseAvatar(true);

        } else {

            // Notify remote peers
            console.log('no-avatar-2');
            otherChannel.send("avatar-disabled");

            setUseAvatar(false);
        }
    };

    // Load face-api.js models
    const loadModels = async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    };

    const detectEmotions = async () => {
        if (localRef.current) {
            const detections = await faceapi
                .detectAllFaces(localRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();
            console.log(detections);
            if (detections.length > 0) {
                const topEmotion = detections[0].expressions.asSortedArray()[0];
                // Add motivational messages based on the detected emotion
                switch (topEmotion.expression) {
                    case 'sad':
                        toast.dark('😢 It\'s okay to feel sad sometimes. Remember, every cloud has a silver lining! 🌈', toaststyles);
                        break;
                    case 'angry':
                        toast.dark('😠 Take a deep breath and count to ten. You’ve got this! 💪', toaststyles);
                        break;
                    case 'fearful':
                        toast.dark('😨 Fear is natural, but don’t let it hold you back. You are stronger than you think! 💫', toaststyles);
                        break;
                    case 'disgusted':
                        toast.dark('🤢 Yuck! Let’s focus on something more positive. 🌟', toaststyles);
                        break;
                    case 'surprised':
                        toast.dark('😲 Wow! Life is full of surprises. Embrace the moment! 🎉', toaststyles);
                        break;
                    case 'happy':
                        toast.dark('😊 Your smile is contagious! Keep spreading positivity! 🌞', toaststyles);
                        break;
                    case 'neutral':
                        toast.dark('😐 Sometimes a neutral mood is just what you need to reflect and recharge. 🧘‍♂️', toaststyles);
                        break;
                    default:
                        toast.dark('🤔 Hmm, not sure what you’re feeling, but remember: You are amazing! 🌟', toaststyles);
                        break;
                }
            }
        }
    };


    // Start emotion detection
    const startEmotionDetection = () => {
        if (!emotionDetectionOn) {
            setEmotionDetectionOn(true);
            detectionInterval.current = setInterval(detectEmotions, 5000); // Run every 5 seconds
            toast.dark('Emotion detection is ON', toaststyles);
        }
    };

    // Stop emotion detection
    const stopEmotionDetection = () => {
        if (emotionDetectionOn) {
            setEmotionDetectionOn(false);
            clearInterval(detectionInterval.current); // Clear the interval
            toast.dark('Emotion detection is OFF', toaststyles);
        }
    };

    // Toggle emotion detection
    const toggleEmotionDetection = () => {
        if (emotionDetectionOn) {
            stopEmotionDetection();
        } else {
            startEmotionDetection();
        }
    };

    // Load models on component mount
    useEffect(() => {
        loadModels();
    }, []);

    // Cleanup interval on component unmount
    useEffect(() => {
        return () => {
            if (detectionInterval.current) {
                clearInterval(detectionInterval.current);
            }
        };
    }, []);


    const toggleVideo = async () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current
                .getTracks()
                .find((track) => track.kind === "video");
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideo(videoTrack.enabled);
                setTimeout(() => {
                    localRef.current.srcObject = localStreamRef.current;
                }, 1000);
            }
        }
    };


    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current
                .getTracks()
                .find((track) => track.kind === "audio");
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(audioTrack.enabled);
                console.log("audio");
            }
        }
    };

    const toggleScreenSharing = async () => {
        if (!isnVideo) {
            toast.warn("Your not allowwed to share the screen while other members shares ...", toaststyles);
            return;
        }
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStreamRef.current = screenStream;
                const senders = pc.getSenders();
                const sender = senders.find(s => s.track?.kind === "video");

                if (!sender) {
                    console.error("No video sender found.");
                    return;
                }

                if (sender) sender.replaceTrack(screenStream.getTracks()[0]);

                otherChannel.send("screen-sharing");

                setIsScreenSharing(!isScreenSharing);
                console.log(isScreenSharing);
                screenStream.getTracks()[0].onended = () => stopScreenSharing();

            } catch (error) {
                console.error("Error sharing screen:", error);
            }
        } else {

            stopScreenSharing();
        }
    };

    const stopScreenSharing = () => {

        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
        }

        otherChannel.send("screen-off");
        console.log("stop", isScreenSharing);

        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        const senders = pc.getSenders();
        const sender = senders.find(s => s.track?.kind === "video");
        if (sender) sender.replaceTrack(videoTrack);
        localStreamRef.current.srcObject = localStreamRef.current;
        setIsScreenSharing(!isScreenSharing);

    };

    const documnet1 = collection(firestore1, 'docref');

    onSnapshot(documnet1, (snapshot) => {

        const data = snapshot.docs.map(doc => ({
            documentref: doc.data().docu1,
            name1: doc.data().meetname,
            meetid: doc.data().meetId,
        }));

        setdocdata(data);

    });

    const setupSources = async (mode, id) => {

        const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        const remoteStream = new MediaStream();


        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });

        };

        if (mode === "create") {

            console.log("created the offer");

            const callDocRef = docdata.filter((check) => check.meetid === id)[0].documentref[0];
            const offerCandidatesRef = collection(callDocRef, "offerCandidates");
            const answerCandidatesRef = collection(callDocRef, "answerCandidates");

            setRoomId(callDocRef.id);

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    addDoc(offerCandidatesRef, event.candidate.toJSON());
                }
            };

            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);

            const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            };

            await setDoc(callDocRef, { offer });

            onSnapshot(callDocRef, (snapshot) => {
                const data = snapshot.data();
                if (!pc.currentRemoteDescription && data?.answer) {
                    const answerDescription = new RTCSessionDescription(data.answer);
                    pc.setRemoteDescription(answerDescription);
                }
            });

            onSnapshot(answerCandidatesRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        pc.addIceCandidate(candidate);
                    }
                });
            });

            setTimeout(() => {
                navigator1('/common/Join');
            }, [2000]);

            toast.dark("You will join the meet soon....", toaststyles);

        } else if (mode === "join") {

            if (id) {

                const callDocRef = doc(firestore1, "calls", id);
                const answerCandidatesRef = collection(callDocRef, "answerCandidates");
                const offerCandidatesRef = collection(callDocRef, "offerCandidates");

                setRoomId(callDocRef.id);

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        addDoc(answerCandidatesRef, event.candidate.toJSON());
                    }
                };

                const callData = (await getDoc(callDocRef)).data();

                if (!callData) {
                    toast.dark('The meeting Id does not exist', toaststyles);
                    return;
                }
                else {
                    toast.dark("You will join the meet soon....", toaststyles);
                }
                const offerDescription = callData.offer;
                await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

                const answerDescription = await pc.createAnswer();
                await pc.setLocalDescription(answerDescription);

                const answer = {
                    type: answerDescription.type,
                    sdp: answerDescription.sdp,
                };

                await setDoc(callDocRef, { answer }, { merge: true });

                onSnapshot(offerCandidatesRef, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const candidate = new RTCIceCandidate(change.doc.data());
                            pc.addIceCandidate(candidate);
                        }
                    });
                });

                setTimeout(() => {
                    navigator1('/common/Join');
                }, [2000]);

            }
            else {
                toast.dark('Enter the meeting Id', toaststyles);
            }

        }

        setTimeout(() => {
            if (localStream.active) {
                localRef.current.srcObject = localStream;
                localStreamRef.current = localStream;
            }
            if (remoteStream.active) {
                setisremote(true);
                setremstream(remoteStream);
                remop = remoteStream;
                remoteRef.current.srcObject = remoteStream;

                console.log(remoteStream, remop);
            }
            else if (!remoteStream.active) {
                setisremote(false);
            }
        }, [3000]);

        const checkRemoteStream = setInterval(() => {
            if (remoteStream.active) {
                clearInterval(checkRemoteStream); // Stop checking once remoteStream is active
                setisremote(true);

                const simple = setInterval(() => {
                    if (remoteStream.active && remoteRef.current) {
                        setisremote(true);
                        clearInterval(simple);
                        setremstream(remoteStream);
                        remoteRef.current.srcObject = remoteStream;
                        remop = remoteStream;

                        const check = setInterval(() => {

                            if (!remoteStream.active) {
                                clearInterval(check);
                                setTimeout(() => {
                                    toast.dark('Successfully Logged out from meet', toaststyles);
                                }, 1000);
                                navigator1('/');
                            }

                        }, 1000);

                    }

                }, 500);

            }
        }, 500); // Check every 500ms

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === "disconnected") {
                hangUp();
            }
        };
    };

    const AvatarModal = () => {

        // AI Avatar URLs
        const avatarUrls = [
            'https://models.readyplayer.me/6460d95f9ae10f45bffb2864.glb',
            'https://api.readyplayer.me/v1/portal/snap-station/gallery/66596aadd136912ab7db852d/portrait',
        ];

        // Handle avatar selection
        const handleAvatarSelect = (url) => {
            console.log('Selected Avatar URL:', url);
            setAvatarSelected(true); // Mark avatar as selected
            toggleAvatar(); // Trigger the toggle function
            close(); // Close the modal
        };

        return (
            <>
                <MantineProvider>
                    {/* Button to open the modal */}
                    <IconButton
                        onClick={() => {
                            if (avatarSelected) {
                                toggleAvatar(); // Directly toggle if avatar is already selected
                            } else {
                                open(); // Open modal to select avatar
                            }
                        }}
                    >
                        <img src={useAvatar ? AI_ON : AI_OFF} alt="AI Avatar" />
                    </IconButton>

                    {/* Modal for avatar selection */}
                    <Modal
                        opened={opened}
                        onClose={close}
                        title="Select an AI Avatar"
                        centered
                        overlayProps={{ blur: 3 }} // Optional: Add a blur effect to the background
                    >
                        <Group>
                            {avatarUrls.map((url, index) => (
                                <Avatar
                                    key={index}
                                    src={url}
                                    size="lg"
                                    radius="xl"
                                    onClick={() => handleAvatarSelect(url)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Group>
                    </Modal>
                </MantineProvider>
            </>
        );
    };



    const hangUp = async () => {

        pc.close();

        if (roomId) {

            const roomRef = doc(firestore1, "calls", roomId);
            const answerCandidatesRef = collection(roomRef, "answerCandidates");
            const offerCandidatesRef = collection(roomRef, "offerCandidates");

            const answerCandidates = await getDocs(answerCandidatesRef);
            answerCandidates.forEach(async (candidate) => {
                await deleteDoc(candidate.ref);
            });

            setisremote(false);

            const offerCandidates = await getDocs(offerCandidatesRef);
            offerCandidates.forEach(async (candidate) => {
                await deleteDoc(candidate.ref);
            });

            await deleteDoc(roomRef);
        }
    };

    // Function to toggle chat visibility
    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        setNewMessageCount(0); // Reset the notification count when chat is opened
    };

    // Function to handle new messages
    const handleNewMessage = () => {
        if (!isChatOpen) {
            setNewMessageCount((prevCount) => prevCount + 1); // Increment count only if chat is closed
        }
    };



    // Handle incoming data channels
    pc.ondatachannel = (event) => {
        const channel = event.channel;
        console.log(channel);
        if (channel.label === "chat") {
            console.log("ok - good - 2");
            // Handle chat messages
            channel.onmessage = (msgEvent) => {
                const message = msgEvent.data;
                const timestamp = new Date(); // Get the current timestamp
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: message, isLocal: false, timestamp }, // Add timestamp
                ]);
                handleNewMessage(); // Notify parent component of a new message
            };
        }
        else if (channel.label === "other") {

            channel.onmessage = (msgEvent) => {

                console.log("Message from peer:", msgEvent.data);

                if (msgEvent.data === "screen-sharing") {

                    setIsnVideo(false);

                } else if (msgEvent.data === "screen-off") {

                    setIsnVideo(true);

                    if (localStreamRef.current) {

                        const videoTrack = localStreamRef.current
                            .getTracks()
                            .find((track) => track.kind === "video");

                        if (videoTrack) {
                            videoTrack.enabled = true;
                            setIsVideo(videoTrack.enabled);
                            setTimeout(() => {
                                localRef.current.srcObject = localStreamRef.current;
                            }, 1000);
                        }
                    }
                }

                if (msgEvent.data === "avatar-enabled") {

                    setTimeout(() => {
                        console.log("intial", remop);
                        setavatar(true);
                    }, 1000);


                    console.log("Remote peer enabled avatar");

                }
                else if (msgEvent.data === "avatar-disabled") {

                    setavatar(false);

                    setTimeout(() => {
                        if (remoteRef.current) {
                            remoteRef.current.srcObject = remop;
                            console.log("final", remop);
                        }
                    }, 2000);
                    console.log("Remote peer disabled avatar");

                }
            };
        }
    };

    // Function to send a chat message
    const sendMessage = () => {
        if (inputMessage.trim() !== '') {
            const timestamp = new Date(); // Get the current timestamp
            chatChannel.send(inputMessage);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: inputMessage, isLocal: true, timestamp }, // Add timestamp
            ]);
            setInputMessage('');
        }
    };


    // Helper function to format time as hh:mm
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {
                (loc.id == "create") && (<Createmeeting />)
            }
            {
                (loc.id == "Joinmeet") && (<JoinMeeting setupSources={setupSources} />)
            }
            {
                (loc.id == "mymeetings") && (<Mymeetings setupSources={setupSources} />)
            }

            {
                (loc.id == "Join")
                &&
                (
                    <AppContainer>
                        <ToastContainer />
                        <header>
                            <HeaderVideo hangUp={hangUp} />
                        </header>
                        <body>
                            <div className="container">
                                <div className="sub-container">
                                    {
                                        (isnVideo) &&
                                        (<div className="sub-1"><video className='videodesign' ref={localRef} autoPlay playsInline></video> </div>)
                                    }

                                    {
                                        (isremote && !avatar) && (<div className="sub-1">
                                            <video className='videodesign' ref={remoteRef} autoPlay></video>
                                        </div>)
                                    }
                                    {(avatar) && (<div className="sub-2">
                                        <AvatarView
                                            localStream={remstream}
                                            onStreamAvailable={(stream) => {
                                                setAvatarStream(stream);
                                            }}
                                        />
                                    </div>)}
                                </div>
                            </div>
                            {isChatOpen && (
                                <ChatWrapper>
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
                                                    <Text isLocal={message.isLocal}>{message.text}</Text>
                                                    <Timestamp>{formatTime(message.timestamp)}</Timestamp>
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
                                </ChatWrapper>
                            )}
                        </body>
                        <footer>
                            <FooterVideo newMessageCount={newMessageCount} chatOpen={isChatOpen} toggleChat={toggleChat} toggleAudio={toggleAudio} emotion_detect={toggleEmotionDetection} emotionDetectionOn={emotionDetectionOn} toggleVideo={toggleVideo} toggleAvatar={toggleAvatar} useAvatar={useAvatar} isScreensharing={isScreenSharing} toggleScreenSharing={toggleScreenSharing} isMuted={isMuted} isVideo={isVideo} setIsVideo={setIsVideo} />
                        </footer>
                    </AppContainer>
                )
            }
        </>
    )
}

const ChatWrapper = styled.div`
  position: fixed;
  bottom: 4rem; // Position above the footer
  right: 1rem; // Position at the right side
  height: 80vh;
  width: 26rem;
  z-index: 1000; // Ensure it appears above other elements
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.9);
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 98vh;

  header {
    position: fixed;
    top:-5px;
    left: 15px;
    background-color: darkgray;
    z-index: 1000;
    height: 3rem; /* Adjust as needed */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    flex-grow: 1;
    width: 77.20rem;
    height: 105%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #001527;
    padding: 1rem;
    margin-left: -16px;
    margin-top: 19px;
    overflow: hidden;

    .sub-container {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: center;
      flex-flow: row;
      gap: 2rem;
      padding: 1rem;
      border-radius: 10px;

      video {
      width: auto; /* Take the full width of the grid cell */
      height: 25rem; /* Take the full height of the grid cell */
      object-fit: cover; /* Maintain aspect ratio and cover the cell */
      border-radius: 8px; /* Add rounded corners if needed */
    }

      .sub-1 {
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        text-align: center;

        // Ensure .sub-1 fits exactly into grid cells
        width: 32rem;
        height: 25rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .video-placeholder {
              
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
          }
      }

      .sub-2 {
            border-radius: 10px;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            text-align: center;
            width: 32rem;
            height: 25rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            overflow: hidden; /* Ensure the avatar doesn't overflow */
    }
    }
  }

  footer {
    position: fixed;
    bottom: 5px;
    width: 100%;
    background-color: darkgray;
    z-index: 1000;
    height: 3rem; /* Adjust as needed */
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;


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
  background-color: #000;
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
  background: ${({ isLocal }) => (isLocal ? '#64ffda' : '#4b79b9')};
  color: ${({ isLocal }) => (isLocal ? '#0a192f' : '#fff')};
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
  background-color: rgb(0, 0, 0);
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

export default Room
