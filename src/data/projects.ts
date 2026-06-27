// Project data configuration file
// 备份在 src/data-backup/projects.ts
// 以后添加项目时参考以下格式：
// {
//   id: "my-project",
//   title: "项目名称",
//   description: "项目描述",
//   image: "/assets/projects/my-project.webp",
//   category: "web", // "web" | "mobile" | "desktop" | "other"
//   techStack: ["Tech1", "Tech2"],
//   status: "completed", // "completed" | "in-progress" | "planned"
//   sourceCode: "https://github.com/...",
//   visitUrl: "https://...",
//   startDate: "2026-01-01",
//   featured: true,
//   tags: ["Tag1", "Tag2"],
//   showImage: true,
// }

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export const projectsData: Project[] = [];

export const getProjectStats = () => ({
	total: 0,
	byStatus: { completed: 0, inProgress: 0, planned: 0 },
});

export const getProjectsByCategory = (category?: string) => [];
export const getFeaturedProjects = () => [];
export const getAllTechStack = () => [];
