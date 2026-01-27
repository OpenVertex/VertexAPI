# Vertex API Manager - ACG Edition 🌸

一个精美的、二次元风格的 API 接口管理系统，基于 Next.js 14 开发。

## 特性

- ✨ **二次元风格 UI**: 采用毛玻璃效果 (Glassmorphism)，丝滑的 Framer Motion 动画。
- 🔍 **API 状态监测**: 一键检测所有接口的可用性（在线/离线/延迟）。
- 📝 **接口管理**: 支持 API 的增删改查 (CRUD)。
- 🚀 **一键部署**: 完美适配 Vercel，无需复杂配置。
- 🎨 **响应式设计**: 同时适配桌面端和移动端。

## 技术栈

- **框架**: [Next.js 14 (App Router)](https://nextjs.org/)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **组件**: Radix UI

## 本地开发

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **启动开发服务器**:
   ```bash
   npm run dev
   ```

3. **访问项目**:
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 部署到 Vercel

本项目支持一键部署到 Vercel：

1. 将代码推送到 GitHub 仓库。
2. 在 Vercel 控制台导入该仓库。
3. 点击 "Deploy" 即可。

## 设计说明

- **背景图片**: 自动从 `https://t.alcy.cc/ycy` 获取随机二次元背景。
- **毛玻璃效果**: 使用 Tailwind 的 `backdrop-blur` 和透明背景色实现。
- **呼吸灯**: 在线和离线状态具有动态呼吸灯效果。

---
Made with ❤️ for the ACG community.
