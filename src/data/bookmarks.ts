// 收藏夹数据配置（原友链已全部迁移至此）
// 格式参考：
// {
//   id: 1,
//   title: "网站名称",
//   imgurl: "https://头像图片URL（可选，留空不显示）",
//   desc: "网站描述",
//   siteurl: "https://网站地址",
//   tags: ["Tag1"],
//   category: "分类名", // Agent / 学习 / Research / 资源榜单 / 工具 / 创业
// }

export interface BookmarkItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
	category: string;
}

export const bookmarksData: BookmarkItem[] = [
	{
		id: 1,
		title: "DG AI Notes",
		imgurl: "",
		desc: "Pi Agent 源码精读笔记，TypeScript 与 Python 双版本",
		siteurl: "https://dg-ai-notes.pages.dev/",
		tags: ["Agent"],
		category: "Agent",
	},
	{
		id: 2,
		title: "深入理解 AI Agent",
		imgurl: "",
		desc: "AI Agent 设计原理与工程实践，完整开源技术书",
		siteurl: "https://bojieli.github.io/ai-agent-book/",
		tags: ["Agent"],
		category: "Agent",
	},
	{
		id: 3,
		title: "Learn Harness Engineering",
		imgurl: "",
		desc: "AI 编程智能体工程化落地课程，聚焦 Harness 脚手架工程",
		siteurl: "https://walkinglabs.github.io/learn-harness-engineering/zh/",
		tags: ["Agent"],
		category: "Agent",
	},
	{
		id: 4,
		title: "AstrBot",
		imgurl: "",
		desc: "Agentic AI 助手，多平台 IM 接入 / 1000+ 插件扩展",
		siteurl: "https://docs.astrbot.app/",
		tags: ["Agent"],
		category: "Agent",
	},
	{
		id: 5,
		title: "oh-my-pi (omp)",
		imgurl: "",
		desc: "终端 AI 编码 Agent，内置 IDE 级别工具面（LSP/DAP/子Agent）",
		siteurl: "https://omp.sh/",
		tags: ["Agent"],
		category: "Agent",
	},
	{
		id: 6,
		title: "Awesome Harness Engineering",
		imgurl: "",
		desc: "Harness 工程工具与指南精选集，Walking Labs 出品",
		siteurl: "https://github.com/walkinglabs/awesome-harness-engineering",
		tags: ["Agent"],
		category: "Agent",
	},
	{
		id: 7,
		title: "Arbor Agent",
		imgurl: "",
		desc: "RUC-NLPIR 基于假设树的自主科研 Agent，自动化科研流程",
		siteurl: "https://ruc-nlpir.github.io/Arbor/docs/zh/",
		tags: ["Agent", "Research"],
		category: "Agent",
	},
	{
		id: 8,
		title: "五道口纳什 · AI 文档",
		imgurl: "",
		desc: "五道口纳什整理的 AI 体系化文档，覆盖 Agent、记忆系统、模型架构等 (感谢纳师!)",
		siteurl: "https://my.feishu.cn/wiki/EHyxwAfPliAKBhkLZLrc4XEDn4e",
		tags: ["Agent"],
		category: "学习",
	},
	{
		id: 9,
		title: "DeepLearning.AI",
		imgurl: "",
		desc: "吴恩达的 AI 学习平台，涵盖 Agent、LLM、ML 等短课程",
		siteurl: "https://learn.deeplearning.ai/",
		tags: ["AI", "学习"],
		category: "学习",
	},
	{
		id: 10,
		title: "Easy Data X AI · 探究 AI Agent 记忆系统",
		imgurl: "",
		desc: "Datawhale 出品的 AI Agent 记忆系统深度教程，从遗忘曲线到永久记忆",
		siteurl: "https://datawhalechina.github.io/easy-data-x-ai/extra/X1%20%E6%8E%A2%E7%A9%B6%20AI%20Agent%20%E8%AE%B0%E5%BF%86%E7%B3%BB%E7%BB%9F%EF%BC%9A%E4%BB%8E%E9%81%97%E5%BF%98%E6%9B%B2%E7%BA%BF%E5%88%B0%E6%B0%B8%E4%B9%85%E8%AE%B0%E5%BF%86.html",
		tags: ["Agent", "Memory"],
		category: "学习",
	},
	{
		id: 11,
		title: "DeepTutor",
		imgurl: "",
		desc: "Agent-native 开源个性化学习伴侣，HKU 出品",
		siteurl: "https://deeptutor.info/zh-cn/",
		tags: ["AI", "学习"],
		category: "学习",
	},
	{
		id: 12,
		title: "DDIA 中文版",
		imgurl: "",
		desc: "《Designing Data-Intensive Applications》第二版中文翻译",
		siteurl: "https://ddia.vonng.com/",
		tags: ["系统设计"],
		category: "学习",
	},
	{
		id: 13,
		title: "Hands-on Modern RL",
		imgurl: "",
		desc: "现代强化学习动手教程，从 CartPole 到 RLHF / Agentic RL",
		siteurl: "https://walkinglabs.github.io/hands-on-modern-rl/preface/intro",
		tags: ["RL"],
		category: "学习",
	},
	{
		id: 14,
		title: "CS146S 中文版",
		imgurl: "",
		desc: "Stanford CS146S 机器学习安全中文课程，含 assignments 与 vibe coding 工具",
		siteurl: "https://github.com/ShouZhengAI/CS146S_CN",
		tags: ["AI", "安全"],
		category: "学习",
	},
	{
		id: 15,
		title: "Easy-Langent",
		imgurl: "",
		desc: "Datawhale 出品的 LangChain 与 LangGraph 智能体开发实践教程，从懂概念到会开发，循序渐进",
		siteurl: "https://easy-langent.datawhale.cc/",
		tags: ["Agent", "学习"],
		category: "学习",
	},
	{
		id: 16,
		title: "Lil'Log",
		imgurl: "",
		desc: "Lilian Weng 的 AI 学习笔记，覆盖 Agent、RL、扩散模型等前沿",
		siteurl: "https://lilianweng.github.io/",
		tags: ["AI", "Research"],
		category: "Research",
	},
	{
		id: 17,
		title: "Anthropic Research",
		imgurl: "",
		desc: "Anthropic 研究团队成果，覆盖对齐、可解释性、前沿红队等",
		siteurl: "https://www.anthropic.com/research",
		tags: ["AI", "Research"],
		category: "Research",
	},
	{
		id: 18,
		title: "Awesome AI Memory",
		imgurl: "",
		desc: "AI 记忆知识库：系统整理 LLM Memory 与 Agent Memory 的前沿研究、工程框架、系统设计与评测基准",
		siteurl: "https://github.com/IAAR-Shanghai/Awesome-AI-Memory",
		tags: ["AI", "Memory"],
		category: "Research",
	},
	{
		id: 19,
		title: "AI Agent Memory",
		imgurl: "",
		desc: "AI Agent 记忆系统深度技术指南：情景记忆、语义记忆、RAG、嵌入与检索，工程师写给工程师",
		siteurl: "https://aiagentmemory.org/",
		tags: ["AI", "Memory"],
		category: "Research",
	},
	{
		id: 20,
		title: "Simon Willison",
		imgurl: "",
		desc: "Simon Willison 的个人博客：AI 工具实测、提示词工程与开源实践，Datasette 作者",
		siteurl: "https://simonwillison.net/",
		tags: ["AI"],
		category: "Research",
	},
	{
		id: 21,
		title: "Good AI List",
		imgurl: "",
		desc: "精选开源 AI 项目榜单，跟踪 GitHub 星标趋势与分类排行",
		siteurl: "https://goodailist.com/repos",
		tags: ["AI"],
		category: "资源榜单",
	},
	{
		id: 22,
		title: "AI 产业链地图",
		imgurl: "",
		desc: "AI 产业链投研平台，实时盯一线、深读研报、系统学产业链",
		siteurl: "https://aichainmap.com/home",
		tags: ["AI"],
		category: "资源榜单",
	},
	{
		id: 23,
		title: "YC Startup Library",
		imgurl: "",
		desc: "Y Combinator 创业知识库，视频、播客与文章",
		siteurl: "https://www.ycombinator.com/library",
		tags: ["创业"],
		category: "创业",
	},
	{
		id: 24,
		title: "Nuwa Skill",
		imgurl: "",
		desc: "蒸馏任何人的思维方式——心智模型、决策启发式、表达 DNA",
		siteurl: "https://github.com/alchaincyf/nuwa-skill",
		tags: ["AI", "Skill"],
		category: "工具",
	},
	{
		id: 25,
		title: "科学空间 | Scientific Spaces",
		imgurl: "",
		desc: "苏剑林的数学与机器学习硬核推导博客，RoFormer 作者，覆盖大模型、注意力机制、优化等深度内容",
		siteurl: "https://kexue.fm/",
		tags: ["AI", "Research"],
		category: "Research",
	},
	{
		id: 26,
		title: "AI Hero",
		imgurl: "",
		desc: "Matt Pocock（Total TypeScript 作者）的 AI 工程化平台：25+ 免费可安装技能，把编码 agent 的工程流程变成可安装技能",
		siteurl: "https://www.aihero.dev/",
		tags: ["AI", "Agent"],
		category: "工具",
	},
	{
		id: 27,
		title: "Agentic Design Patterns（谷歌新书中文版）",
		imgurl: "",
		desc: "《Agentic Design Patterns》最佳中文翻译：21 个核心模式（提示链/路由/并行化/反思/工具使用/规划/多智能体/记忆管理/RAG/安全/评估等）+ 7 个附录，在线可读",
		siteurl: "https://github.com/xindoo/agentic-design-patterns",
		tags: ["Agent", "设计模式", "翻译"],
		category: "Agent",
	},
	{
		id: 28,
		title: "操作系统导论（中文版）",
		imgurl: "",
		desc: "OSTEP《Operating Systems: Three Easy Pieces》中文翻译版，虚拟化/并发/持久化三大主题，附全书目录与各章节 PDF",
		siteurl: "https://itanken.github.io/ostep-chinese/",
		tags: ["操作系统", "系统"],
		category: "学习",
	},
];

export function getBookmarksList(): BookmarkItem[] {
	return bookmarksData;
}

export function getBookmarksByCategory(): Record<string, BookmarkItem[]> {
	const groups: Record<string, BookmarkItem[]> = {};
	for (const item of bookmarksData) {
		const cat = item.category || "其他";
		(groups[cat] ??= []).push(item);
	}
	return groups;
}
