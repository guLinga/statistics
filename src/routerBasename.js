/** Vite base；根域名部署时为 /，项目子路径时为 /仓库名/ */
export const routerBasename = (() => {
  const base = import.meta.env.BASE_URL || "/";
  if (base === "/") return undefined;
  return base.replace(/\/$/, "");
})();
