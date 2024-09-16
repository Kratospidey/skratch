// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import Canvas from "@/components/Canvas";
import { database } from "@/lib/firebase";
import { ref, onValue, update, get, DataSnapshot } from "firebase/database";
import { TooltipProvider } from "@/components/ui/tooltip";
import ColorSelectorButton from "@/components/ColorSelectorButton";
import { toast } from "react-toastify";

export default function HomePage() {
	const [userId, setUserId] = useState<string | null>(null);
	const COOLDOWN_PERIOD = 5000; // 5000 milliseconds = 5 seconds
	const [cooldown, setCooldown] = useState<number>(0);
	const [selectedColor, setSelectedColor] = useState("#E50000"); // Default color

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUserId(user.uid);
			} else {
				signInAnonymously(auth)
					.then((result) => {
						setUserId(result.user.uid);
					})
					.catch((error) => {
						console.error("Error signing in anonymously:", error);
						toast.error("Authentication failed. Please refresh the page.");
					});
			}
		});

		return () => unsubscribe();
	}, []);

	const [pixelData, setPixelData] = useState<{ [key: string]: string }>({});

	useEffect(() => {
		const pixelsRef = ref(database, "pixels");

		const unsubscribe = onValue(pixelsRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				setPixelData(data); // Update local state when data changes
			}
		});

		return () => unsubscribe();
	}, []);

	function handlePixelClick(x: number, y: number) {
		if (!userId) return;

		const userCooldownRef = ref(database, `cooldowns/${userId}`);

		get(userCooldownRef).then((snapshot: DataSnapshot) => {
			const lastActionTime = snapshot.val();
			const currentTime = Date.now();

			// If cooldown is over or user is placing a pixel for the first time
			if (!lastActionTime || currentTime - lastActionTime >= COOLDOWN_PERIOD) {
				const updates: { [key: string]: string | number } = {};
				const pixelKey = `${y}:${x}`;

				// Update the pixel data with the selected color
				updates[`pixels/${pixelKey}`] = selectedColor;
				updates[`cooldowns/${userId}`] = currentTime;

				update(ref(database), updates)
					.then(() => {
						// Update local state to reflect the change
						setPixelData((prevData) => ({
							...prevData,
							[pixelKey]: selectedColor, // Update the pixel color in local state
						}));
					})
					.catch((error) => {
						console.error("Error updating data:", error);
						toast.error("Failed to place pixel. Please try again.");
					});

				// Set cooldown timer
				setCooldown(COOLDOWN_PERIOD / 1000);
			} else {
				const remainingTime = Math.ceil(
					(COOLDOWN_PERIOD - (currentTime - lastActionTime)) / 1000
				);
				toast.warn(
					`Please wait ${remainingTime} seconds before placing another pixel.`
				);
				setCooldown(remainingTime);
			}
		});
	}

	useEffect(() => {
		if (cooldown > 0) {
			const timer = setTimeout(() => {
				setCooldown(cooldown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [cooldown]);

	return (
		<TooltipProvider>
			<div className="relative">
				<Canvas
					pixelData={pixelData}
					onPixelClick={handlePixelClick}
					cooldown={cooldown}
				/>
				<ColorSelectorButton
					selectedColor={selectedColor}
					setSelectedColor={setSelectedColor}
				/>
				{cooldown > 0 && (
					<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded">
						Cooldown: {cooldown} seconds
					</div>
				)}
			</div>
		</TooltipProvider>
	);
}
