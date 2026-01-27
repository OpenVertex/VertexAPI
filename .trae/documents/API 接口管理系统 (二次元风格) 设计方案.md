# API 接口管理系统 (二次元风格) 开发计划

我们将构建一个基于 **Next.js 14+** 的 API 管理系统，采用极具视觉冲击力的 **二次元 (ACG) 毛玻璃风格**。系统将支持 API 的 CRUD 管理以及一键可用性检测。

## 1. 项目基础配置
- **框架**: Next.js 14 (App Router) + TypeScript。
- **样式**: Tailwind CSS + `lucide-react` 图标。
- **视觉核心**: 
    - 使用 `https://t.alcy.cc/ycy` 作为全屏固定背景。
    - 实现 **Glassmorphism (毛玻璃)** 效果：半透明背景 (`bg-white/40`)、高斯模糊 (`backdrop-blur-xl`) 和细腻的白色边框。
    - 采用樱花粉 (`#FFB7C5`) 和天空蓝 (`#87CEEB`) 作为主色调。

## 2. 后端逻辑 (API Routes)
- **`app/api/apis/route.ts`**: 处理 API 列表的增删改查。为了方便 Vercel 一键部署，我们将使用一个内存变量或本地文件（在开发环境）模拟数据库。
- **`app/api/check/route.ts`**: 核心检测逻辑。通过后端发送请求来规避浏览器的 CORS 限制，返回 API 的存活状态。

## 3. 前端组件开发
- **`app/layout.tsx`**: 设置全局二次元背景和毛玻璃容器。
- **`app/page.tsx`**: 主界面，包含标题、功能按钮区和 API 卡片网格。
- **`components/ApiCard.tsx`**: 
    - 展示 API 名称、方法 (GET/POST)、URL。
    - 状态指示灯（呼吸灯效果）：在线 (绿)、离线 (红)、检测中 (动画)。
- **`components/ApiModal.tsx`**: 使用 `Radix UI` / `shadcn/ui` 的 Dialog 组件实现优雅的添加/编辑表单。

## 4. 功能实现
- **一键检测**: 遍历 API 列表，并发调用后端检测接口，实时更新前端状态。
- **响应式设计**: 适配桌面端和移动端，确保在任何设备上都有丝滑的交互体验。

## 5. 部署准备
- 优化项目结构，确保 `git push vercel main` 即可完成部署。

---
**确认后，我将直接开始输出完整代码。**
