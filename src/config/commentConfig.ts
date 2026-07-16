import type { CommentConfig } from "../types/config";
import { SITE_LANG } from "./siteConfig";

// 评论系统配置
export const commentConfig: CommentConfig = {
	enable: true, // 启用评论功能
	system: "giscus", // 使用 Giscus
	twikoo: {
		envId: "", // 部署 Twikoo 后填入 envId（Vercel URL）
		lang: SITE_LANG,
	},
	giscus: {
		repo: "C-surfing/my-blog",
		repoId: "R_kgDOTE282A",
		category: "Announcements",
		categoryId: "DIC_kwDOTE282M4DBTiD",
		mapping: "pathname",
		strict: "1",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "top",
		theme: "preferred_color_scheme",
		lang: "zh-CN",
		loading: "lazy",
	},
};
