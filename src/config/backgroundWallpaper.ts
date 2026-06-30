import type { FullscreenWallpaperConfig } from "../types/config";

export const fullscreenWallpaperConfig: FullscreenWallpaperConfig = {
	enable: true,
	src: {
		desktop: [
			"/assets/desktop-banner/cb-1.webp",
			"/assets/desktop-banner/cb-2-v3.webp",
			"/assets/desktop-banner/cb-3.webp",
			"/assets/desktop-banner/cb-4-v2.webp",
			"/assets/desktop-banner/cb-5.webp",
		],
		mobile: [
			"/assets/mobile-banner/cb-1.webp",
			"/assets/mobile-banner/cb-2-v3.webp",
			"/assets/mobile-banner/cb-3.webp",
			"/assets/mobile-banner/cb-4-v2.webp",
			"/assets/mobile-banner/cb-5.webp",
		],
	},
	position: "center",
	carousel: {
		enable: true,
		interval: 5,
	},
	zIndex: -1,
	opacity: 0.8,
	blur: 1,
	switchable: true,
	overlay: {
		opacity: 0.8, // 壁纸不透明度，0-1
		blur: 1.5, // 背景模糊半径（px）
		cardOpacity: 0.8, // 卡片不透明度，0-1
		switchable: {
			opacity: true,
			blur: true,
			cardOpacity: true,
		},
	},
	fullscreen: {
		switchable: {
			opacity: true,
			blur: true,
		},
	},
};
