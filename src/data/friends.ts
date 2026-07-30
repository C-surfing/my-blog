// 友情链接数据配置
// 备份在 src/data-backup/friends.ts
// 以后添加友链时参考以下格式：
// {
//   id: 1,
//   title: "网站名称",
//   imgurl: "https://头像图片URL",
//   desc: "网站描述",
//   siteurl: "https://网站地址",
//   tags: ["Tag1"],
// }

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "Good AI List",
		imgurl: "",
		desc: "精选开源 AI 项目榜单，跟踪 GitHub 星标趋势与分类排行",
		siteurl: "https://goodailist.com/repos",
		tags: ["AI"],
	},
	{
		id: 2,
		title: "DG AI Notes",
		imgurl: "",
		desc: "Pi Agent 源码精读笔记，TypeScript 与 Python 双版本",
		siteurl: "https://dg-ai-notes.pages.dev/",
		tags: ["Agent"],
	},
	{
		id: 3,
		title: "深入理解 AI Agent",
		imgurl: "",
		desc: "AI Agent 设计原理与工程实践，完整开源技术书",
		siteurl: "https://bojieli.github.io/ai-agent-book/",
		tags: ["Agent"],
	},
	{
		id: 4,
		title: "YC Startup Library",
		imgurl: "",
		desc: "Y Combinator 创业知识库，视频、播客与文章",
		siteurl: "https://www.ycombinator.com/library",
		tags: ["创业"],
	},
	{
		id: 5,
		title: "DeepLearning.AI",
		imgurl: "",
		desc: "吴恩达的 AI 学习平台，涵盖 Agent、LLM、ML 等短课程",
		siteurl: "https://learn.deeplearning.ai/",
		tags: ["学习"],
	},
	{
		id: 6,
		title: "Learn Harness Engineering",
		imgurl: "",
		desc: "AI 编程智能体工程化落地课程，聚焦 Harness 脚手架工程",
		siteurl: "https://walkinglabs.github.io/learn-harness-engineering/zh/",
		tags: ["Agent"],
	},
	{
		id: 7,
		title: "Easy Data X AI · 探究 AI Agent 记忆系统",
		imgurl: "",
		desc: "Datawhale 出品的 AI Agent 记忆系统深度教程，从遗忘曲线到永久记忆",
		siteurl: "https://datawhalechina.github.io/easy-data-x-ai/extra/X1%20%E6%8E%A2%E7%A9%B6%20AI%20Agent%20%E8%AE%B0%E5%BF%86%E7%B3%BB%E7%BB%9F%EF%BC%9A%E4%BB%8E%E9%81%97%E5%BF%98%E6%9B%B2%E7%BA%BF%E5%88%B0%E6%B0%B8%E4%B9%85%E8%AE%B0%E5%BF%86.html",
		tags: ["Agent", "Memory"],
	},
	{
		id: 8,
		title: "五道口纳什 · AI 文档",
		imgurl: "",
		desc: "五道口纳什整理的 AI 体系化文档，覆盖 Agent、记忆系统、模型架构等 (感谢纳师!)",
		siteurl: "https://my.feishu.cn/wiki/EHyxwAfPliAKBhkLZLrc4XEDn4e",
		tags: ["Agent"],
	},
	{
		id: 9,
		title: "Arbor Agent",
		imgurl: "",
		desc: "RUC-NLPIR 基于假设树的自主科研 Agent，自动化科研流程",
		siteurl: "https://ruc-nlpir.github.io/Arbor/docs/zh/",
		tags: ["Agent", "Research"],
	},
];

export function getFriendsList(): FriendItem[] {
	return friendsData;
}

export function getShuffledFriendsList(): FriendItem[] {
	return [];
}
