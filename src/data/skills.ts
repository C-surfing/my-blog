// Skill data configuration file
// 备份在 src/data-backup/skills.ts
// 以后添加技能时参考以下格式：
// {
//   id: "my-skill",
//   name: "技能名称",
//   description: "技能描述",
//   icon: "logos:javascript", // Iconify 图标名
//   category: "frontend", // "frontend" | "backend" | "database" | "tools" | "other"
//   level: "intermediate", // "beginner" | "intermediate" | "advanced" | "expert"
//   experience: { years: 2, months: 0 },
//   color: "#059669",
// }

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string;
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[];
	certifications?: string[];
	color?: string;
}

export const skillsData: Skill[] = [];

export const getSkillsByCategory = (category?: string) => [];
export const getAllCategories = () => [];
export const getSkillLevelColor = (level: string) => "";
