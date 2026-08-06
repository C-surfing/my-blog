// 友情链接数据配置（友链 = 认识的人的网站）
// 备份在 src/data-backup/friends.ts（24 条历史数据）
// 以后添加友链时参考以下格式：
// {
//   id: 1,
//   title: "网站名称",
//   imgurl: "https://头像图片URL（可选，留空不显示）",
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

export const friendsData: FriendItem[] = [];

export function getFriendsList(): FriendItem[] {
	return friendsData;
}

export function getShuffledFriendsList(): FriendItem[] {
	return friendsData.sort(() => Math.random() - 0.5);
}
