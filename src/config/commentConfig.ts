import type { CommentConfig } from "../types/config";
import { SITE_LANG } from "./siteConfig";

// 评论系统配置
export const commentConfig: CommentConfig = {
	enable: true, // 启用评论功能
	system: "twikoo", // 使用 Twikoo
	twikoo: {
		envId: "", // 部署 Twikoo 后填入 envId（Vercel URL）
		lang: SITE_LANG,
	},
	giscus: {
		repo: "C-surfing/my-blog",
		repoId: "",
		category: "Announcements",
		categoryId: "",
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "top",
		theme: "preferred_color_scheme",
		lang: SITE_LANG,
		loading: "lazy",
	},
};
