// Timeline data configuration file
// 备份在 src/data-backup/timeline.ts
// 以后添加时间线条目时参考以下格式：
// {
//   id: "my-event",
//   title: "事件标题",
//   description: "事件描述",
//   type: "education", // "education" | "work" | "project" | "achievement"
//   startDate: "2026-01-01",
//   endDate: "2026-06-01", // 可选
//   location: "深圳",
//   organization: "某组织",
//   skills: ["Skill1", "Skill2"],
//   achievements: ["成就1", "成就2"],
//   icon: "material-symbols:school",
//   color: "#059669",
//   featured: true,
// }

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	type: "education" | "work" | "project" | "achievement";
	startDate: string;
	endDate?: string;
	location?: string;
	organization?: string;
	position?: string;
	skills?: string[];
	achievements?: string[];
	links?: { name: string; url: string; type: string }[];
	icon?: string;
	color?: string;
	featured?: boolean;
}

export const timelineData: TimelineItem[] = [];
