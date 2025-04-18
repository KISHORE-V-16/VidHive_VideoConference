import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

const Canvas = styled.canvas`
  border: 1px solid #ddd;
  background-color: #fff;
  width: 100%;
  height: 400px;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Whiteboard = ({ socket }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;

    if (socket) {
      socket.onmessage = (event) => {
        const { x, y, isDrawing } = JSON.parse(event.data);
        if (isDrawing) {
          contextRef.current.lineTo(x, y);
          contextRef.current.stroke();
        } else {
          contextRef.current.moveTo(x, y);
        }
      };
    }
  }, [socket]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    socket?.send(
      JSON.stringify({ x: offsetX, y: offsetY, isDrawing: false })
    );
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    socket?.send(
      JSON.stringify({ x: offsetX, y: offsetY, isDrawing: true })
    );
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    contextRef.current.beginPath();
  };

  const clearCanvas = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket?.send(JSON.stringify({ clear: true }));
  };

  return (
    <div>
      <Toolbar>
        <Button onClick={clearCanvas}>Clear Whiteboard</Button>
      </Toolbar>
      <Canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default Whiteboard;
