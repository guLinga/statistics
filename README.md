# 统计

**看不懂英文字段？** 请先看 [配置说明.md](./配置说明.md)。

React + Vite 项目。

## 启动

```bash
cd "/Users/xujiaen/Desktop/项目/statistics"
npm install
npm run dev
```

浏览器打开终端显示的地址（默认 http://localhost:5173）。

## 路由

| 路径 | 页面 |
|------|------|
| `/attendance` | 每日读经打卡及周六日上线 |
| `/duty` | 安排 |

访问 `/` 会自动跳转到 `/attendance`。

## 部署 GitHub Pages

生产 base 路径已配置在 `.env.production`（`/statistics/`）。

```bash
npm run build:pages
```

会生成 `dist/` 并校验不含 `/src/main.jsx`。

### GitHub Actions 自动部署

workflow 把 **dist 内容** 推到 `gh-pages` 分支。

**Settings → Pages** 配置：

- **Source**：Deploy from a branch
- **Branch**：`gh-pages` / **/(root)**

推送 `main` 后 Actions 自动构建部署。

### 访问地址

```
https://gulinga.github.io/statistics/
https://gulinga.github.io/statistics/attendance
```

不要访问 `https://gulinga.github.io/`（根域名不是本项目）。

若仍报 `/src/main.jsx 404`，说明 Pages 还在用 `main` 分支源码，请改为 `gh-pages` 分支。

## 数据源

- 优先从 Supabase 拉取（复制 `.env.example` 为 `.env` 并填写密钥）
- 未配置或拉取失败时，回退读取 `public/config.json`、`public/duty.json`

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建到 `dist/` |
| `npm run preview` | 预览构建结果 |

## 文件

| 文件 | 用途 |
|------|------|
| `public/config.json` | 每日读经打卡（本地回退） |
| `public/duty.json` | 每周服侍安排（本地回退） |
| `src/api/supabase.js` | Supabase 连接 |
| `src/components/` | React 组件 |
| `配置说明.md` | 字段中文对照 |

## 编辑弹窗

读经打卡卡片右上角 **编辑** 可查看/修改当天记录（弹窗仅展示，保存暂不写入）。
