# 小红书文生图 - AI一键生成小红书图文

把长文章一键转成小红书可发布的分段文案与每段配图，轻松创作爆款内容。

## 功能特性

### 核心功能
- **AI智能改写** - 将长文章自动改写成小红书风格，口语化、接地气
- **自动分段** - 根据文章长度智能拆分成6-12个段落，每段50-80字
- **AI配图生成** - 为每个段落自动生成精美3:4配图
- **一键复制下载** - 支持全文复制、单张/批量下载图片

### 交互特点
- **三步向导** - 输入原文 → 选择风格 → 获取结果
- **5种改写语气** - 轻松种草、专业测评、故事叙述、幽默搞笑、情感共鸣
- **6种配图风格** - 美食探店、旅行日记、穿搭分享、生活日常、美妆护肤、知识分享
- **实时进度** - 可视化展示改写和生图进度
- **图片预览** - 支持放大查看生成的配图

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 14 + React 18 |
| 样式 | Tailwind CSS |
| 文案改写 | DeepSeek API |
| 图片生成 | 火山引擎豆包文生图 API |
| 部署 | Vercel |

## 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/zxc9802/xiaohongshu.git
cd xiaohongshu

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入 API 密钥

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 环境变量

创建 `.env.local` 文件：

```env
# DeepSeek API配置（用于文字改写）
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

# 火山引擎（豆包）API配置（用于图片生成）
ARK_API_KEY=your_ark_api_key
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
ARK_IMAGE_MODEL=doubao-seedream-4-5-251128
```

## 部署到 Vercel

1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量（见上方）
4. 点击 Deploy

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── rewrite/        # 文案改写 API
│   │   ├── generate-image/ # 图片生成 API
│   │   └── download/       # 图片下载代理
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 主页面
├── components/
│   ├── InputCard.tsx       # 步骤1: 输入原文
│   ├── ConfigCard.tsx      # 步骤2: 选择风格
│   ├── ResultCard.tsx      # 步骤3: 结果展示
│   ├── StepIndicator.tsx   # 步骤指示器
│   └── TaskProgress.tsx    # 任务进度条
└── types/
    └── index.ts            # TypeScript 类型定义
```

## 使用流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. 输入原文  │ ──▶ │  2. 选择风格  │ ──▶ │  3. 获取结果  │
│  粘贴长文章   │     │  语气+配图   │     │  复制+下载   │
└─────────────┘     └─────────────┘     └─────────────┘
```

## API 说明

### POST /api/rewrite
文案改写接口

**请求体：**
```json
{
  "rawText": "原始文章内容",
  "toneId": "casual",
  "freePrompt": "可选的额外要求"
}
```

### POST /api/generate-image
图片生成接口

**请求体：**
```json
{
  "sectionText": "段落文字内容",
  "styleId": "food",
  "freePrompt": "可选的额外风格要求"
}
```

### GET /api/download
图片下载代理

**参数：**
- `url` - 图片URL
- `filename` - 下载文件名

## 设计风格

采用小红书品牌设计语言：
- **主色调**: 珊瑚红 (#FF2442)
- **圆角卡片**: 2xl-3xl 圆角
- **渐变按钮**: 柔和的红色渐变
- **字体**: Noto Sans SC

## License

MIT

## 致谢

- [DeepSeek](https://deepseek.com) - 提供文案改写能力
- [火山引擎](https://volcengine.com) - 提供豆包文生图能力
- [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) - 设计系统参考
