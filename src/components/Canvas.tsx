// src/components/Canvas.tsx
"use client";

import { FC, useRef, useEffect, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface CanvasProps {
	pixelData: { [key: string]: string };
	onPixelClick: (x: number, y: number) => void;
	cooldown: number; // Added cooldown prop
}

const GRID_WIDTH = 1000; // Number of columns
const GRID_HEIGHT = 1000; // Number of rows
const CELL_SIZE = 10; // Size of each pixel in the grid

const Canvas: FC<CanvasProps> = ({ pixelData, onPixelClick, cooldown }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Local cache of drawn pixels
	const drawnPixelsRef = useRef<Set<string>>(new Set());

	// Handle window resize and set initial dimensions
	useEffect(() => {
		const handleResize = () => {
			const canvas = canvasRef.current;
			if (!canvas) return; // Ensure canvas is available

			// Adjust canvas size based on window size if needed
			if (
				canvas.width !== GRID_WIDTH * CELL_SIZE ||
				canvas.height !== GRID_HEIGHT * CELL_SIZE
			) {
				canvas.width = GRID_WIDTH * CELL_SIZE;
				canvas.height = GRID_HEIGHT * CELL_SIZE;

				// Fill background with white
				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.fillStyle = "#FFFFFF";
					ctx.fillRect(0, 0, canvas.width, canvas.height);

					// Clear drawnPixelsRef since canvas was cleared
					drawnPixelsRef.current.clear();

					// Redraw all pixels
					Object.entries(pixelData).forEach(([key, color]) => {
						const [y, x] = key.split(":").map(Number);
						ctx.fillStyle = color;
						ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
						drawnPixelsRef.current.add(key);
					});
				}
			}
		};

		handleResize(); // Set initial dimensions
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [pixelData]);

	// Draw pixels on the canvas
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return; // Ensure canvas is available

		const ctx = canvas.getContext("2d");
		if (!ctx) return; // Exit if context is not available

		// Draw only new pixels
		Object.entries(pixelData).forEach(([key, color]) => {
			if (drawnPixelsRef.current.has(key)) return; // Skip if already drawn

			const [y, x] = key.split(":").map(Number);
			ctx.fillStyle = color;
			ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

			drawnPixelsRef.current.add(key);
		});
	}, [pixelData]);

	// Handle canvas clicks
	const handleCanvasClick = useCallback(
		(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
			if (cooldown > 0) return; // Ignore clicks during cooldown

			const canvas = canvasRef.current;
			if (!canvas) return;

			const rect = canvas.getBoundingClientRect();
			const scaleX = canvas.width / rect.width;
			const scaleY = canvas.height / rect.height;

			const x = Math.floor(((event.clientX - rect.left) * scaleX) / CELL_SIZE);
			const y = Math.floor(((event.clientY - rect.top) * scaleY) / CELL_SIZE);

			// Boundary check
			if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return;

			onPixelClick(x, y);
		},
		[onPixelClick, cooldown]
	);

	return (
		<div
			className="canvas-container overflow-hidden"
			style={{ width: "100vw", height: "100vh" }}
		>
			<TransformWrapper
				initialScale={1}
				minScale={0.1}
				maxScale={10}
				wheel={{ step: 0.1 }}
				doubleClick={{ disabled: true }}
			>
				<TransformComponent>
					<canvas
						ref={canvasRef}
						style={{
							cursor: cooldown > 0 ? "not-allowed" : "crosshair",
							imageRendering: "pixelated",
						}}
						onClick={handleCanvasClick}
					/>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
};

export default Canvas;
