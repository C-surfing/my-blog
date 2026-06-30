import type { Song } from "./types";

export const STORAGE_KEY_VOLUME = "music-player-volume";

export const DEFAULT_VOLUME = 0.7;

export const LOCAL_PLAYLIST: Song[] = [
	{
		id: 1,
		title: "Our First Time",
		artist: "Bruno Mars",
		cover: "/favicon/favicon.ico",
		url: "/assets/music/url/bruno-mars-our-first-time.mp3",
		duration: 0,
	},
	{
		id: 2,
		title: "I'd Rather Pretend",
		artist: "Bryant Barnes",
		cover: "/favicon/favicon.ico",
		url: "/assets/music/url/bryant-barnes-pretend.mp3",
		duration: 0,
	},
	{
		id: 3,
		title: "All Around Me",
		artist: "Justin Bieber",
		cover: "/favicon/favicon.ico",
		url: "/assets/music/url/justin-bieber-all-around-me.mp3",
		duration: 0,
	},
	{
		id: 4,
		title: "For Days",
		artist: "RINI",
		cover: "/favicon/favicon.ico",
		url: "/assets/music/url/rini-for-days.mp3",
		duration: 0,
	},
	{
		id: 5,
		title: "Open Hearts",
		artist: "The Weeknd",
		cover: "/favicon/favicon.ico",
		url: "/assets/music/url/the-weeknd-open-hearts.mp3",
		duration: 0,
	},
	{
		id: 6,
		title: "TAKE ME (Sweetshirt Remix)",
		artist: "Sweetshirt",
		cover: "/favicon/favicon.ico",
		url: "/assets/music/url/sweetshirt-take-me.mp3",
		duration: 0,
	},
];

export const DEFAULT_SONG: Song = {
	title: "Sample Song",
	artist: "Sample Artist",
	cover: "/favicon/favicon.ico",
	url: "",
	duration: 0,
	id: 0,
};

export const DEFAULT_METING_API =
	"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
export const DEFAULT_METING_ID = "14164869977";
export const DEFAULT_METING_SERVER = "netease";
export const DEFAULT_METING_TYPE = "playlist";

export const ERROR_DISPLAY_DURATION = 3000;
export const SKIP_ERROR_DELAY = 1000;
