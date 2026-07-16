#!/usr/bin/env bash
# 从本地 Memos 实例同步日记到博客静态数据
# 用法: bash scripts/sync-memos.sh
# 运行后更新 src/data/diary.ts，然后 pnpm build 重新部署

MEMOS_URL="http://localhost:5231"
OUTPUT_FILE="src/data/diary.ts"
LIMIT=50

echo "正在从 Memos ($MEMOS_URL) 获取日记..."

# 调用 Memos API 获取公开 memo
RESPONSE=$(curl -s "$MEMOS_URL/api/v1/memos?limit=$LIMIT")

# 检查是否成功
if [ -z "$RESPONSE" ]; then
  echo "错误: 无法连接到 Memos，请确认容器正在运行 (docker ps)"
  exit 1
fi

# 生成 diary.ts
cat > "$OUTPUT_FILE" << 'HEADER'
// 日记数据配置
// 由 scripts/sync-memos.sh 自动生成，请勿手动编辑

export interface DiaryItem {
	id: number;
	content: string;
	date: string;
	images?: string[];
	location?: string;
	mood?: string;
	tags?: string[];
}

const diaryData: DiaryItem[] = [
HEADER

echo "$RESPONSE" | python3 -c "
import json, sys, os

data = json.load(sys.stdin)
memos = data.get('memos', [])

# 只取 PUBLIC 且 NORMAL 的
items = []
for m in memos:
    if m.get('visibility') != 'PUBLIC' or m.get('state') != 'NORMAL':
        continue
    tags = m.get('tags', [])
    # 从 content 提取 #tag
    import re
    for word in m.get('content', '').split():
        if word.startswith('#'):
            tags.append(word[1:])
    
    item = {
        'content': m['content'],
        'date': m['createTime'],
        'tags': list(set(tags)),
    }
    
    # 处理附件图片
    attachments = m.get('attachments', [])
    images = []
    for a in attachments:
        if a.get('type', '').startswith('image/'):
            images.append(a['name'])
    if images:
        item['images'] = images
    
    items.append(item)

# 按时间倒序排列
items.sort(key=lambda x: x['date'], reverse=True)

# 输出类型声明
with open(os.environ.get('OUTPUT', 'src/data/diary.ts'), 'a') as f:
    for i, item in enumerate(items):
        f.write('\t{\n')
        f.write(f'\t\tid: {i+1},\n')
        f.write(f'\t\tcontent: {json.dumps(item[\"content\"], ensure_ascii=False)},\n')
        f.write(f'\t\tdate: {json.dumps(item[\"date\"], ensure_ascii=False)},\n')
        if item.get('tags'):
            f.write(f'\t\ttags: {json.dumps(item[\"tags\"], ensure_ascii=False)},\n')
        if item.get('images'):
            f.write(f'\t\timages: {json.dumps(item[\"images\"], ensure_ascii=False)},\n')
        f.write('\t},\n')
" 2>&1

# 追加文件尾部
cat >> "$OUTPUT_FILE" << 'TAIL'
];

export const getDiaryList = (limit?: number) => {
	const sortedData = [...diaryData].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

export const getAllTags = () => {
	const tags = new Set<string>();
	for (const item of diaryData) {
		if (item.tags) {
			for (const tag of item.tags) {
				tags.add(tag);
			}
		}
	}
	return Array.from(tags).sort();
};
TAIL

echo "✅ 同步完成！已生成 $OUTPUT_FILE"
echo "运行 pnpm build 重新部署即可发布"
