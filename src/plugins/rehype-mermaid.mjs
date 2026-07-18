import { h } from "hastscript";
import { visit } from "unist-util-visit";

import mermaidRenderScript from "./mermaid-render-script.js?raw";

export function rehypeMermaid() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (
				node.tagName === "div" &&
				node.properties &&
				node.properties.className &&
				node.properties.className.includes("mermaid-container")
			) {
				// 在 hast 中，data-* 属性会被转为驼峰格式
				const mermaidCode = node.properties.dataMermaidCode || "";

				if (!mermaidCode) {
					console.warn("[rehypeMermaid] No mermaid code found in node");
					return;
				}

				const mermaidId = `mermaid-${Math.random().toString(36).slice(-6)}`;

				// 用 script type="text/mermaid" 存储代码
				const mermaidContainer = h(
					"div",
					{
						class: "mermaid-wrapper",
						id: mermaidId,
					},
					[
						h("div", { class: "mermaid" }, [
							h("script", {
								type: "text/mermaid",
							}, mermaidCode),
						]),
					],
				);

				// 创建客户端渲染脚本
				const renderScript = h(
					"script",
					{
						type: "text/javascript",
					},
					mermaidRenderScript,
				);

				// 替换原始节点
				node.tagName = "div";
				node.properties = { class: "mermaid-diagram-container" };
				node.children = [mermaidContainer, renderScript];
			}
		});
	};
}
