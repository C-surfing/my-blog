import type { MusicPlayerConfig } from "../types/config";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	enable: true,
	showFloatingPlayer: true,
	floatingEntryMode: "fab",
	mode: "meting",
	meting_api:
		"http://localhost:3000/api?server=:server&type=:type&id=:id&auth=:auth&r=:r", // 本地开发用，生产需替换
	id: "3778678", // 热歌榜
	server: "netease",
	type: "playlist",
};
