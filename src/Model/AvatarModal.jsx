// import React, { useState } from 'react';
// import { Modal, Button, Group, Avatar,MantineProvider } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import styled from 'styled-components';
// import AI_ON from '../asserts/AI_ON.png';
// import AI_OFF from '../asserts/AI_OFF.png';

// const AvatarModal = ({ useAvatar, toggleAvatar }) => {
//     const [opened, { open, close }] = useDisclosure(false); // Control modal visibility
//     const [avatarSelected, setAvatarSelected] = useState(false); // Track if avatar is selected

//     // AI Avatar URLs
//     const avatarUrls = [
//         'https://models.readyplayer.me/6460d95f9ae10f45bffb2864.glb',
//         'https://api.readyplayer.me/v1/portal/snap-station/gallery/66596aadd136912ab7db852d/portrait',
//     ];

//     // Handle avatar selection
//     const handleAvatarSelect = (url) => {
//         console.log('Selected Avatar URL:', url);
//         setAvatarSelected(true); // Mark avatar as selected
//         toggleAvatar(); // Trigger the toggle function
//         close(); // Close the modal
//     };

//     return (
//         <>
//         <MantineProvider>
//             {/* Button to open the modal */}
//             <IconButton
//                 onClick={() => {
//                     if (avatarSelected) {
//                         toggleAvatar(); // Directly toggle if avatar is already selected
//                     } else {
//                         open(); // Open modal to select avatar
//                     }
//                 }}
//             >
//                 <img src={useAvatar ? AI_ON : AI_OFF} alt="AI Avatar" />
//             </IconButton>

//             {/* Modal for avatar selection */}
//             <Modal
//                 opened={opened}
//                 onClose={close}
//                 title="Select an AI Avatar"
//                 centered
//                 overlayProps={{ blur: 3 }} // Optional: Add a blur effect to the background
//             >
//                 <Group>
//                     {avatarUrls.map((url, index) => (
//                         <Avatar
//                             key={index}
//                             src={url}
//                             size="lg"
//                             radius="xl"
//                             onClick={() => handleAvatarSelect(url)}
//                             style={{ cursor: 'pointer' }}
//                         />
//                     ))}
//                 </Group>
//             </Modal>
//             </MantineProvider>
//         </>
//     );
// };

// const IconButton = styled.button`
//     width: max-content;
//     font-size: 19px;
//     border-radius: 15px;
//     color: white;
//     background-color: black;
//     box-shadow: 1px 1px 10px #0373fc;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     border: none;
//     transition: all 0.5s ease-in-out;

//     &:hover {
//         transform: scale(1.09);
//         color: black;
//         background-color: #0056b3;
//         box-shadow: 1px 1px 10px black;
//     }

//     img {
//         width: 40px;
//         height: 40px;
//         border-radius: 50%;
//     }
// `;

// export default AvatarModal;