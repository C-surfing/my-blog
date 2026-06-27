import type { PioConfig } from "../types/config";

export const pioConfig: PioConfig = {
	enable: true,
	models: ["/pio/models/NOIR/noir.model3.json"],
	position: "left",
	width: 280,
	height: 250,
	mode: "draggable",
	hiddenOnMobile: true,
	hideAboutMenu: false,
	dialog: {
		welcome: "Welcome to Csurfing's Agent Lab!",
		touch: ["Hey!", "Pika~?", "Don't poke me!"],
		home: "Back to homepage?",
		skin: ["Check this out!", "Looking good~"],
		close: "See you!",
		link: "https://github.com/C-surfing/my-blog",
	},
};
