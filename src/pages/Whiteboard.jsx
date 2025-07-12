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
  const contextRef = useRef(null);

  // Color palette with a variety of colors
  const colorPalette = [
    // Blacks & Grays
    "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
    // Reds
    "#FF0000", "#FF3333", "#FF6666", "#FF9999", "#FFCCCC", "#FF6B6B",
    // Oranges
    "#FFA500", "#FFB74D", "#FFCC80", "#FFE0B2", "#FFF3E0", "#FF9F43",
    // Yellows
    "#FFFF00", "#FFF176", "#FFEE58", "#FFEB3B", "#FDD835", "#FFD32A",
    // Greens
    "#00FF00", "#81C784", "#66BB6A", "#4CAF50", "#2E7D32", "#1B5E20",
    // Blues
    "#0000FF", "#42A5F5", "#1E88E5", "#1976D2", "#1565C0", "#0D47A1",
    // Purples
    "#9C27B0", "#AB47BC", "#BA68C8", "#CE93D8", "#E1BEE7", "#F3E5F5",
    // Pinks
    "#FF00FF", "#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B"
  ];

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

    // Save initial blank canvas to history
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
      context.putImageData(imageData, 0, 0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update context when color, brush size, or tool changes
  useEffect(() => {
    if (contextRef.current) {
      if (tool === "eraser") {
        contextRef.current.globalCompositeOperation = 'destination-out';
        contextRef.current.strokeStyle = 'rgba(0, 0, 0, 1)'; // Any color with alpha works here
      } else {
        contextRef.current.globalCompositeOperation = 'source-over';
        contextRef.current.strokeStyle = color;
      }
      contextRef.current.lineWidth = brushSize;
      contextRef.current.lineCap = 'round';
      contextRef.current.lineJoin = 'round';
    }
  }, [color, brushSize, tool]);

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

  // Drawing functions
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    saveToHistory();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
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
              className={`p-2 rounded-md ${
                tool === "brush" ? "bg-zinc-600" : "bg-zinc-700 hover:bg-zinc-600"
              }`}
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
              onClick={() => {
                setTool("eraser");
                setShowColorPicker(false);
              }}
              className={`p-2 rounded-md ${
                tool === "eraser" ? "bg-zinc-600" : "bg-zinc-700 hover:bg-zinc-600"
              }`}
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
                <div
                  className="rounded-full bg-zinc-300"
                  style={{ width: size, height: size }}
                ></div>
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
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-zinc-800 rounded-lg shadow-lg z-10 w-48 grid grid-cols-6 gap-2">
                {colorPalette.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      setShowColorPicker(false);
                      setTool("brush");
                    }}
                    className={`w-6 h-6 rounded-full ${color === c ? 'ring-2 ring-white' : ''}`}
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
                historyIndex <= 0
                  ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  : "bg-zinc-700 hover:bg-zinc-600"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-md bg-zinc-700 hover:bg-zinc-600"
              title="Clear"
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
