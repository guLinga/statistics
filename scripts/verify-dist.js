import fs from "fs";

const html = fs.readFileSync("dist/index.html", "utf8");

if (html.includes("/src/main.jsx")) {
  console.error("错误：dist/index.html 仍是开发版，包含 /src/main.jsx");
  process.exit(1);
}

if (!html.includes("/statistics/assets/")) {
  console.error("错误：dist/index.html 未包含 /statistics/assets/ 路径");
  console.error(html);
  process.exit(1);
}

console.log("dist 校验通过");
console.log(html.match(/src="[^"]+"/)?.[0] ?? html);
