import React, { useEffect, useRef, useState } from "react";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState("brush");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [savedImageData, setSavedImageData] = useState(null);
  const contextRef = useRef(null);

  // Color palette with a variety of colors
  const colorPalette = [
    // Blacks & Grays
    "#000000",
    "#333333",
    "#666666",
    "#999999",
    "#CCCCCC",
    "#FFFFFF",
    // Reds
    "#FF0000",
    "#FF3333",
    "#FF6666",
    "#FF9999",
    "#FFCCCC",
    "#FF6B6B",
    // Oranges
    "#FFA500",
    "#FFB74D",
    "#FFCC80",
    "#FFE0B2",
    "#FFF3E0",
    "#FF9F43",
    // Yellows
    "#FFFF00",
    "#FFF176",
    "#FFEE58",
    "#FFEB3B",
    "#FDD835",
    "#FFD32A",
    // Greens
    "#00FF00",
    "#81C784",
    "#66BB6A",
    "#4CAF50",
    "#2E7D32",
    "#1B5E20",
    // Blues
    "#0000FF",
    "#42A5F5",
    "#1E88E5",
    "#1976D2",
    "#1565C0",
    "#0D47A1",
    // Purples
    "#9C27B0",
    "#AB47BC",
    "#BA68C8",
    "#CE93D8",
    "#E1BEE7",
    "#F3E5F5",
    // Pinks
    "#FF00FF",
    "#F06292",
    "#EC407A",
    "#E91E63",
    "#D81B60",
    "#C2185B",
  ];

  // Draw grid background
  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const gridSize = 20; // Size of grid cells
    const dotSize = 1; // Size of dots

    // Set dark background (zinc-900)
    context.fillStyle = "#18181b";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Primary grid dots (zinc-700)
    context.fillStyle = "#3f3f46";

    // Draw dots in a grid pattern
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        context.beginPath();
        context.arc(x, y, dotSize, 0, Math.PI * 2);
        context.fill();
      }
    }

    // Secondary grid dots (zinc-600, slightly larger and more visible)
    context.fillStyle = "#52525b";
    const largeGridSize = gridSize * 5; // 5x5 grid of the small dots

    for (let x = 0; x < canvas.width; x += largeGridSize) {
      for (let y = 0; y < canvas.height; y += largeGridSize) {
        context.beginPath();
        context.arc(x, y, dotSize * 1.5, 0, Math.PI * 2);
        context.fill();
      }
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Draw initial grid
    drawGrid();
    saveToHistory();

    // Handle window resize
    const handleResize = () => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;
      context.scale(2, 2);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = color;
      context.lineWidth = brushSize;

      // Redraw grid and restore content
      drawGrid();
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
      };
      img.src = imageData;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update tool change effect to handle shape tools
  useEffect(() => {
    if (contextRef.current) {
      if (tool === "eraser") {
        contextRef.current.globalCompositeOperation = "destination-out";
        contextRef.current.strokeStyle = "rgba(0, 0, 0, 1)";
      } else {
        contextRef.current.globalCompositeOperation = "source-over";
        if (tool !== "rectangle" && tool !== "circle" && tool !== "line" && tool !== "arrow") {
          contextRef.current.strokeStyle = color;
        }
      }
      if (tool !== "rectangle" && tool !== "circle" && tool !== "line" && tool !== "arrow") {
        contextRef.current.lineWidth = brushSize;
        contextRef.current.lineCap = "round";
        contextRef.current.lineJoin = "round";
      }
    }
  }, [color, brushSize, tool]);

  // Save canvas state before drawing a shape
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setSavedImageData(context.getImageData(0, 0, canvas.width, canvas.height));
  };

  // Restore canvas state (used when drawing shapes)
  const restoreCanvasState = () => {
    if (savedImageData) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.putImageData(savedImageData, 0, 0);
    }
  };

  // Draw shape based on current tool
  const drawShape = (endX, endY) => {
    if (!savedImageData) return;

    restoreCanvasState();
    const context = contextRef.current;
    const startX = startPos.x;
    const startY = startPos.y;

    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = brushSize;

    switch (tool) {
      case "rectangle":
        context.strokeRect(startX, startY, endX - startX, endY - startY);
        break;
      case "circle":
        // Calculate radius based on distance from start to current point
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        // Calculate center point to make circle expand from bottom right
        const centerX = startX + (endX - startX) / 2;
        const centerY = startY + (endY - startY) / 2;
        context.beginPath();
        context.arc(centerX, centerY, radius / 2, 0, 2 * Math.PI);
        context.stroke();
        break;
      case "line":
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
        break;
      case "arrow":
        // Draw the line
        context.beginPath();
        context.lineWidth = brushSize;
        context.strokeStyle = color;

        // Shorten the line a bit to make room for the arrow head
        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = Math.max(brushSize * 2.5, 15);
        const backOffset = headLength * 0.7; // How much to shorten the line

        // Adjust end point to make room for arrow head
        const adjustedEndX = endX - Math.cos(angle) * backOffset;
        const adjustedEndY = endY - Math.sin(angle) * backOffset;

        // Draw the main line
        context.moveTo(startX, startY);
        context.lineTo(adjustedEndX, adjustedEndY);
        context.stroke();

        // Draw arrow head (sleek triangle design)
        context.save();
        context.translate(endX, endY);
        context.rotate(angle);

        const headWidth = headLength * 0.6;
        const backWidth = headLength * 0.3;

        context.beginPath();
        context.fillStyle = color;
        context.moveTo(0, 0); // Tip of the arrow
        context.lineTo(-headLength, -headWidth); // Bottom point
        context.quadraticCurveTo(
          -headLength * 0.8,
          0, // Control point for curve
          -headLength,
          headWidth // Top point with curve
        );
        context.closePath();
        context.fill();
        context.restore();
        break;
      default:
        break;
    }
  };

  // Save current canvas state to history
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    // Remove any "future" history if we're not at the latest point
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const img = new Image();
      img.src = history[newIndex];
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  };

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const img = new Image();
      img.src = history[newIndex];
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  };

  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  // Download canvas as PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "whiteboard.png";
    link.click();
  };

  // Update startDrawing to handle shapes
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (["rectangle", "circle", "line", "arrow"].includes(tool)) {
      setStartPos({ x: offsetX, y: offsetY });
      setIsDrawingShape(true);
      saveCanvasState();
    } else {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  // Update draw function to handle shapes
  const draw = ({ nativeEvent }) => {
    if (!isDrawing && !isDrawingShape) return;

    const { offsetX, offsetY } = nativeEvent;

    if (isDrawingShape) {
      drawShape(offsetX, offsetY);
    } else {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  // Update finishDrawing to handle shapes
  const finishDrawing = () => {
    if (isDrawingShape) {
      setIsDrawingShape(false);
      setSavedImageData(null);
      saveToHistory();
    } else {
      contextRef.current.closePath();
      setIsDrawing(false);
      saveToHistory();
    }
  };

  // Touch support
  const startDrawingTouch = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const drawTouch = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-zinc-800 border-b border-zinc-700">
        <h1 className="text-xl font-bold">Whiteboard</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="w-16 bg-zinc-800 border-r border-zinc-700 flex flex-col items-center py-4 space-y-6">
          {/* Tool selection */}
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => setTool("brush")}
              className={`p-2 rounded-md ${tool === "brush" ? "bg-zinc-600" : "bg-zinc-700 hover:bg-zinc-600"}`}
              title="Brush"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke={color === "#000000" ? "currentColor" : color}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              onClick={() => setTool("rectangle")}
              className={`p-2 rounded-md ${tool === "rectangle" ? "bg-zinc-600" : "bg-zinc-700 hover:bg-zinc-600"}`}
              title="Rectangle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
              </svg>
            </button>
            <button
              onClick={() => setTool("circle")}
              className={`p-2 rounded-md ${tool === "circle" ? "bg-zinc-600" : "bg-zinc-700 hover:bg-zinc-600"}`}
              title="Circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
              </svg>
            </button>
            <button
              onClick={() => setTool("line")}
              className={`p-2 rounded-md ${tool === "line" ? "bg-zinc-600" : "bg-zinc-700 hover:bg-zinc-600"}`}
              title="Line"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeWidth="2" d="M4 20L20 4" />
              </svg>
            </button>
            <button
              onClick={() => setTool("arrow")}
              className={`p-2 rounded-md ${tool === "arrow" ? "bg-zinc-600" : "bg-zinc-700 hover:bg-zinc-600"}`}
              title="Arrow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button
              onClick={() => {
                setTool("eraser");
                setShowColorPicker(false);
              }}
              className={`p-2 rounded-md ${tool === "eraser" ? "bg-zinc-600" : "bg-zinc-700 hover:bg-zinc-600"}`}
              title="Eraser"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Brush size */}
          <div className="flex flex-col items-center space-y-2">
            {[2, 5, 10, 15, 20].map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  brushSize === size ? "bg-zinc-600" : "bg-zinc-700 hover:bg-zinc-600"
                }`}
                title={`Size ${size}`}
              >
                <div className="rounded-full bg-zinc-300" style={{ width: size, height: size }}></div>
              </button>
            ))}
          </div>

          {/* Color picker section */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-8 h-8 rounded-full border-2 border-zinc-600"
              style={{ backgroundColor: color }}
              title="Select color"
            />
            {showColorPicker && (
              <div className="absolute bottom-full left-28 transform -translate-x-1/2 mb-2 p-2 bg-zinc-800 rounded-lg shadow-lg z-10 w-48 grid grid-cols-6 gap-2">
                {colorPalette.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      setShowColorPicker(false);
                      setTool("brush");
                    }}
                    className={`w-6 h-6 rounded-full ${color === c ? "ring-2 ring-white" : ""}`}
                    style={{ backgroundColor: c }}
                    title={`Color: ${c}`}
                  />
                ))}
                <div className="col-span-6 mt-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                      setTool("brush");
                    }}
                    className="w-full h-8 cursor-pointer bg-zinc-700 rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* History controls */}
          <div className="flex flex-col items-center space-y-2 mt-auto">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-2 rounded-md ${
                historyIndex <= 0 ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" : "bg-zinc-700 hover:bg-zinc-600"
              }`}
              title="Undo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-2 rounded-md ${
                historyIndex >= history.length - 1
                  ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  : "bg-zinc-700 hover:bg-zinc-600"
              }`}
              title="Redo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button onClick={handleClear} className="p-2 rounded-md bg-zinc-700 hover:bg-zinc-600" title="Clear">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-zinc-900 relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseOut={finishDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawingTouch}
            onTouchEnd={finishDrawing}
            onTouchMove={drawTouch}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
