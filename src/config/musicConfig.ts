import type { MusicPlayerConfig } from "../types/config";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	enable: false, // 未自建 Meting API，先关闭音乐播放器
	showFloatingPlayer: false,
	mode: "local",
	meting_api: "",
	id: "",
	server: "netease",
	type: "playlist",
};
