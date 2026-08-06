import type { FooterConfig } from "../types/config";

// 页脚配置
export const footerConfig: FooterConfig = {
	enable: true, // 是否启用Footer HTML注入功能
	customHtml: `© 2026 Csurfing · <a href="https://csurfing.xyz/" target="_blank" rel="noopener noreferrer">Csurfing's Agent Lab</a> · Built with <a href="https://astro.build" target="_blank" rel="noopener noreferrer">Astro</a> + <a href="https://github.com/LyraVoid/Mizuki" target="_blank" rel="noopener noreferrer">Mizuki</a>`,
	// 也可以直接编辑 FooterConfig.html 文件来添加备案号等自定义内容
	// 注意：若 customHtml 不为空，则使用 customHtml 中的内容；若 customHtml 留空，则使用 FooterConfig.html 文件中的内容
	// FooterConfig.html 可能会在未来的某个版本弃用
};
