/** Vite base 配置，GitHub Pages 项目站需设为 /仓库名/ */
export const routerBasename = (() => {
  const base = import.meta.env.BASE_URL || "/";
  if (base === "/") return undefined;
  return base.replace(/\/$/, "");
})();
