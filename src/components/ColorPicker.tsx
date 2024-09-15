// src/components/ColorPicker.tsx
"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface ColorPickerProps {
	selectedColor: string;
	setSelectedColor: (color: string) => void;
}

interface Color {
	name: string;
	hex: string;
}

const colors: Color[] = [
	{ name: "White", hex: "#FFFFFF" },
	{ name: "Light Gray", hex: "#E4E4E4" },
	{ name: "Gray", hex: "#888888" },
	{ name: "Black", hex: "#222222" },
	{ name: "Pink", hex: "#FFA7D1" },
	{ name: "Red", hex: "#E50000" },
	{ name: "Orange", hex: "#E59500" },
	{ name: "Brown", hex: "#A06A42" },
	{ name: "Yellow", hex: "#E5D900" },
	{ name: "Light Green", hex: "#94E044" },
	{ name: "Green", hex: "#02BE01" },
	{ name: "Cyan", hex: "#00D3DD" },
	{ name: "Light Blue", hex: "#0083C7" },
	{ name: "Blue", hex: "#0000EA" },
	{ name: "Dark Blue", hex: "#000080" },
	{ name: "Indigo", hex: "#6A5CFF" },
	{ name: "Violet", hex: "#811E9F" },
	{ name: "Purple", hex: "#B44AC0" },
	{ name: "Light Pink", hex: "#FF3881" },
	{ name: "Salmon", hex: "#FF99AA" },
	{ name: "Apricot", hex: "#FFD635" },
	{ name: "Gold", hex: "#FFB470" },
	{ name: "Mint", hex: "#00CC78" },
	{ name: "Lime", hex: "#7EED56" },
	{ name: "Teal", hex: "#00756F" },
	{ name: "Dark Green", hex: "#009EAA" },
	{ name: "Sky Blue", hex: "#51E9F4" },
	{ name: "Ultramarine", hex: "#493AC1" },
	{ name: "Magenta", hex: "#6D001A" },
	{ name: "Burgundy", hex: "#BE0039" },
	{ name: "Peach", hex: "#D4D7D9" },
	{ name: "Maroon", hex: "#6D482F" },
];

const ColorPicker: FC<ColorPickerProps> = ({
	selectedColor,
	setSelectedColor,
}) => {
	const [open, setOpen] = useState(false);

	return (
		<div className="mt-4">
			{/* Color Selector Button */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button>Choose Color</Button>
				</DialogTrigger>
				<DialogContent className="dialog-overlay">
					<DialogHeader>
						<DialogTitle>Select a Color</DialogTitle>
					</DialogHeader>
					{/* Color Options Grid */}
					<div className="grid grid-cols-5 gap-2">
						{colors.map((color) => (
							<Button
								key={color.hex}
								style={{ backgroundColor: color.hex }}
								className={`w-12 h-12 p-0 ${
									selectedColor === color.hex
										? "ring-2 ring-offset-2 ring-black"
										: ""
								}`}
								onClick={() => {
									setSelectedColor(color.hex);
									setOpen(false);
								}}
							>
								<span className="sr-only">{color.name}</span>
							</Button>
						))}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ColorPicker;
