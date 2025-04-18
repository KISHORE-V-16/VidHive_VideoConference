import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Canvas, useFrame, useGraph } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Matrix4, Euler } from 'three';
import styled from 'styled-components';

let faceLandmarker;
let lastVideoTime = -1;
let blendshapes = [];
let rotation;
let headMesh = [];

const AvatarView = ({ onStreamAvailable, localStream }) => {
  
  const [url] = useState("https://models.readyplayer.me/6460d95f9ae10f45bffb2864.glb");
  const canvasRef = useRef();
  const videoRef = useRef();
  const animationRef = useRef();

  // Avatar GLB loader
  const AvatarModel = ({ url }) => {
    const { scene } = useGLTF(url);
    const { nodes } = useGraph(scene);

    // Log the model's node structure for debugging
    useEffect(() => {
      console.log("Model nodes:", nodes);
    }, [nodes]);

    useEffect(() => {
      if (nodes.Wolf3D_Head) headMesh.push(nodes.Wolf3D_Head);
      if (nodes.Wolf3D_Teeth) headMesh.push(nodes.Wolf3D_Teeth);
      if (nodes.Wolf3D_Beard) headMesh.push(nodes.Wolf3D_Beard);
      if (nodes.Wolf3D_Avatar) headMesh.push(nodes.Wolf3D_Avatar);
      if (nodes.Wolf3D_Head_Custom) headMesh.push(nodes.Wolf3D_Head_Custom);
    }, [nodes, url]);

    useFrame(() => {
      if (blendshapes.length > 0 && rotation) {
        blendshapes.forEach(element => {
          headMesh.forEach(mesh => {
            const index = mesh.morphTargetDictionary[element.categoryName];
            if (index >= 0) mesh.morphTargetInfluences[index] = element.score;
          });
        });

        // Check if the Head node exists before accessing its rotation
        if (nodes.Head) {
          nodes.Head.rotation.set(rotation.x, rotation.y, rotation.z);
        } else {
          console.warn("Head node not found in the model.");
        }
      }
    });

    return <primitive object={scene} position={[0, -1.75, 3]} />;
  };

  // Setup face tracking using local stream
  useEffect(() => {
    const setupFaceTracking = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
          },
          numFaces: 1,
          runningMode: "VIDEO",
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
        });

        // Use the local stream for face tracking
        videoRef.current.srcObject = localStream;
        videoRef.current.onloadeddata = () => {
          videoRef.current.play();
          predict();
        };
      } catch (error) {
        console.error("Error setting up face tracking:", error);
      }
    };

    const predict = () => {
      if (videoRef.current && videoRef.current.currentTime !== lastVideoTime) {
        lastVideoTime = videoRef.current.currentTime;
        const results = faceLandmarker.detectForVideo(videoRef.current, Date.now());

        if (results.faceBlendshapes?.[0]?.categories) {
          blendshapes = results.faceBlendshapes[0].categories;
          const matrix = new Matrix4().fromArray(results.facialTransformationMatrixes[0].data);
          rotation = new Euler().setFromRotationMatrix(matrix);
        }
      }
      animationRef.current = requestAnimationFrame(predict);
    };

    setupFaceTracking();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [localStream]);

  // Capture canvas stream for WebRTC
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      // Set a valid canvas size (e.g., 1280x720)
      const containerWidth = 32 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const containerHeight = 25 * parseFloat(getComputedStyle(document.documentElement).fontSize);

      canvas.width = containerWidth; // Set canvas width
      canvas.height = containerHeight; // Set canvas height

      // Capture the stream
      const canvasStream = canvas.captureStream(30); // 30 FPS
      onStreamAvailable(canvasStream);
    }
  }, [onStreamAvailable]);

  return (
    <Avatarstyle>
      <div className="avatar-view">
        {/* Hidden video element for processing */}
        <video ref={videoRef} style={{ display: 'none' }} autoPlay playsInline />

        {/* Visible avatar canvas */}
        <Canvas ref={canvasRef} camera={{ fov: 25, position: [0, 0, 5] }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} />
          <AvatarModel url={url} />
        </Canvas>
      </div>
    </Avatarstyle>
  );
};

export default AvatarView;

const Avatarstyle = styled.div`
  .avatar-view {
    width: 28rem; /* Container width */
    height: 25rem; /* Container height */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; /* Prevent overflow */
  }

  .avatar-view canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;