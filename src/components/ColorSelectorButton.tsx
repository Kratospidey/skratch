// src/components/ColorSelectorButton.tsx
"use client";

import { FC, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
	DialogHeader,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import colors from "@/lib/colors";

interface ColorSelectorButtonProps {
	selectedColor: string;
	setSelectedColor: (color: string) => void;
}

const ColorSelectorButton: FC<ColorSelectorButtonProps> = ({
	selectedColor,
	setSelectedColor,
}) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button className="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-md flex items-center space-x-2 bg-white text-black hover:bg-white hover:text-black focus:outline-none">
					<span>Color Selection</span>
					<div
						className="w-6 h-6 rounded-full border border-gray-300"
						style={{ backgroundColor: selectedColor }}
					/>
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select a Color</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-5 gap-4">
					{colors.map((color) => (
						<button
							key={color.hex}
							className={cn(
								"w-12 h-12 rounded-full focus:outline-none transition-transform transform hover:scale-105",
								selectedColor === color.hex
									? "ring-2 ring-offset-2 ring-white"
									: ""
							)}
							style={{ backgroundColor: color.hex }}
							onClick={() => {
								setSelectedColor(color.hex);
								setOpen(false);
							}}
						>
							<span className="sr-only">{color.name}</span>
						</button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ColorSelectorButton;
