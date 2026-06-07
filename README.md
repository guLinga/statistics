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

项目站地址形如 `https://<用户名>.github.io/<仓库名>/`，需配置 **base 路径**。

1. 复制 `.env.production.example` 为 `.env.production`
2. 把 `VITE_BASE_PATH` 改成你的仓库名，例如仓库叫 `statistics`：

```bash
VITE_BASE_PATH=/statistics/
```

3. 打包（会生成 `404.html` 以支持前端路由刷新）：

```bash
npm run build:pages
```

4. 将 `dist/` 目录部署到 GitHub Pages

### GitHub Actions 自动部署

已包含 `.github/workflows/deploy-pages.yml`。在仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。

在 **Settings → Secrets and variables → Actions** 添加（可选）：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

推送 `main`/`master` 分支后会自动构建，base 路径使用 `/仓库名/`。

### 本地预览 Pages 路径

```bash
cp .env.production.example .env.production
# 编辑 VITE_BASE_PATH
npm run build:pages
npm run preview:pages
```

访问 `http://localhost:4173/statistics/`（路径与 `VITE_BASE_PATH` 一致）。

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
