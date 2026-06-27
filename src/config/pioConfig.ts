import type { PioConfig } from "../types/config";

// Pio 看板娘配置
export const pioConfig: PioConfig = {
	enable: true,
	models: ["/pio/models/Pichu/Pichu.model3.json"],
	position: "left",
	width: 280,
	height: 250,
	mode: "draggable",
	hiddenOnMobile: true,
	hideAboutMenu: false,
	dialog: {
		welcome: "Welcome to Csurfing's Agent Lab!",
		touch: [
			"Hey! That tickles!",
			"Pika~?",
			"Don't poke me!",
			"I'm working on some RL papers!",
		],
		home: "Back to homepage?",
		skin: ["Check this out!", "Looking good~"],
		close: "See you! Come back for more agents!",
		link: "https://github.com/C-surfing/my-blog",
	},
};
