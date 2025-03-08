import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import useImage from "use-image";
import axios from "axios";
import bed_image from "../assets/bed_image.jpg";
import Instructions from "./Instructions";


// Draggable Image Component
const DraggableImage = ({ object, onDragMove }) => {
  const [img] = useImage(object.image); // Load Image Dynamically
  return (
    <Image
      id={object.id}
      x={object.x}
      y={object.y}
      width={object.width}
      height={object.height}
      image={img}
      draggable
      onDragMove={onDragMove}
    />
  );
};

const FloorPlanner = () => {
  const [objects, setObjects] = useState([]); // Empty State Initially
  const stageRef = useRef(null);

  // Fetch Data from Node.js Server
  useEffect(() => {
    axios.get("http://localhost:5000/api/floorplan")
      .then((response) => {
        console.log("resepon", response.data)
        if(response.data.length) { 
            response.data[0].image = bed_image
            setObjects(response.data); // Set Objects from API Response
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle Drag Movement
  const handleDragMove = (e) => {
    const id = e.target.id();
    setObjects((prev) =>
      prev.map((obj) =>
        obj.id === id ? { ...obj, x: e.target.x(), y: e.target.y() } : obj
      )
    );
  };

  // Handle Zoom In & Out
  useEffect(() => {
    const stage = stageRef.current;
    stage.on("wheel", (e) => {
      e.evt.preventDefault();
      const scaleBy = 1.05;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

      stage.scale({ x: newScale, y: newScale });

      // Keep the zoom centered
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    });
  }, []);

  return (
    <>
    <Instructions />
        <Stage ref={stageRef} width={window.innerWidth} height={window.innerHeight} draggable>
      <Layer className="layer">
        {/* Draw Bedroom Walls */}
        <Rect x={20} y={20} width={800} height={400} stroke="black" strokeWidth={4} />

        {/* Draw Images for Objects */}
        {objects.map((obj) => (
          <DraggableImage key={obj.id} object={obj} onDragMove={handleDragMove} />
        ))}
      </Layer>
    </Stage>
    </>
  );
};

export default FloorPlanner;

