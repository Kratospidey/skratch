// src/components/Canvas.tsx
"use client";

import { FC, memo, useState, useEffect } from "react";
import { FixedSizeGrid as Grid, GridChildComponentProps } from "react-window";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface CanvasProps {
	pixelData: { [key: string]: string };
	onPixelClick: (x: number, y: number) => void;
}

const GRID_SIZE = 2000;
const CELL_SIZE = 10;

const Canvas: FC<CanvasProps> = ({ pixelData, onPixelClick }) => {
	const [dimensions, setDimensions] = useState<{
		width: number;
		height: number;
	}>({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		// Set the dimensions on the client side
		const updateDimensions = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		updateDimensions(); // Initial setting

		// Add a resize event listener
		window.addEventListener("resize", updateDimensions);

		// Cleanup event listener on unmount
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	const Cell = memo(
		({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
			const key = `${rowIndex}:${columnIndex}`;
			const color = pixelData[key] || "#FFFFFF";

			return (
				<div
					style={{
						...style,
						backgroundColor: color,
						boxSizing: "border-box",
					}}
					onClick={() => onPixelClick(columnIndex, rowIndex)}
					className="relative group"
				>
					<div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-20 transition-opacity"></div>
				</div>
			);
		}
	);

	return (
		<div
			className="canvas-container"
			style={{ width: "100vw", height: "100vh" }}
		>
			{dimensions.width > 0 && dimensions.height > 0 && (
				<TransformWrapper
					initialScale={1}
					minScale={0.1}
					maxScale={10}
					wheel={{ step: 0.1 }}
					doubleClick={{ disabled: true }}
				>
					<TransformComponent>
						<Grid
							columnCount={GRID_SIZE}
							rowCount={GRID_SIZE}
							columnWidth={CELL_SIZE}
							rowHeight={CELL_SIZE}
							width={dimensions.width}
							height={dimensions.height}
						>
							{Cell}
						</Grid>
					</TransformComponent>
				</TransformWrapper>
			)}
		</div>
	);
};

export default Canvas;
