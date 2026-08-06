import type { SakuraConfig } from "../types/config";

export const sakuraConfig: SakuraConfig = {
	enable: true,
	switchable: true,
	sakuraNum: 12, // 樱花数量（调稀）
	limitTimes: -1,
	size: {
		min: 0.5, // 樱花最小尺寸倍数
		max: 1.0, // 樱花最大尺寸倍数
	},
	opacity: {
		min: 0.3, // 樱花最小不透明度
		max: 0.8, // 樱花最大不透明度
	},
	speed: {
		horizontal: {
			min: -1.0, // 水平移动速度最小值（调慢）
			max: -0.6, // 水平移动速度最大值（调慢）
		},
		vertical: {
			min: 1.0, // 垂直移动速度最小值（调慢）
			max: 1.4, // 垂直移动速度最大值（调慢）
		},
		rotation: 0.02, // 旋转速度（调慢）
		fadeSpeed: 0.02, // 消失速度（调慢），不应大于最小不透明度
	},
	zIndex: 100, // 层级，确保樱花在合适的层级显示
};
