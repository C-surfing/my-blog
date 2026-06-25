import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.webp", // 相对于 /src 目录
	name: "Roderick",
	bio: "Agent / RL / LLM Engineering. Building intelligent systems.",
	typewriter: {
		enable: true,
		speed: 80,
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/C-surfing",
		},
		{
			name: "Bilibili",
			icon: "fa7-brands:bilibili",
			url: "https://space.bilibili.com/",
		},
	],
};
