const WIDTH = 750;
const PADDING = 36;
const CONTENT_WIDTH = WIDTH - PADDING * 2;
const FONT =
  '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif';

const COLORS = {
  bg: "#ffffff",
  text: "#1e293b",
  muted: "#64748b",
  accent: "#2563eb",
  absent: "#b91c1c",
  border: "#e2e8f0",
  rowBg: "#f8fafc",
  absentRowBg: "#fef2f2",
  absentBorder: "#fecaca",
};

function setFont(ctx, size, weight = "normal") {
  ctx.font = `${weight} ${size}px ${FONT}`;
}

function wrapText(ctx, text, maxWidth) {
  if (!text) return [""];
  const lines = [];
  let line = "";
  for (const char of text) {
    const next = line + char;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function dayDetailText(day) {
  if (!day.hasRecord) return "当日暂无打卡记录";
  if (day.absentCount === 0) return "全员已打卡";
  return `缺卡：${day.absent.join("、")}`;
}

function dayMetaText(day) {
  if (!day.hasRecord) return "无记录";
  if (day.absentCount === 0) return "全员已打卡";
  return `${day.absentCount} 人缺卡`;
}

function measureReport(ctx, report) {
  const lineHeight = (size) => size * 1.55;
  let height = PADDING;

  setFont(ctx, 28, "600");
  height += lineHeight(28) + 8;

  setFont(ctx, 15);
  height += lineHeight(15) + 6;

  setFont(ctx, 14);
  height += lineHeight(14) + 24;

  report.days.forEach((day, index) => {
    height += 18;
    setFont(ctx, 16, "600");
    height += lineHeight(16) + 10;

    setFont(ctx, 15);
    const detailLines = wrapText(ctx, dayDetailText(day), CONTENT_WIDTH - 24);
    height += detailLines.length * lineHeight(15) + 16;

    if (index < report.days.length - 1) height += 12;
  });

  height += PADDING;
  return height;
}

function drawRoundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawReport(ctx, report, height) {
  const lineHeight = (size) => size * 1.55;
  let y = PADDING;

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, WIDTH, height);

  setFont(ctx, 28, "600");
  ctx.fillStyle = COLORS.text;
  ctx.fillText("本周缺卡", PADDING, y + 28);
  y += lineHeight(28) + 8;

  setFont(ctx, 15);
  ctx.fillStyle = COLORS.muted;
  ctx.fillText(report.weekRange, PADDING, y + 15);
  y += lineHeight(15) + 6;

  const totalAbsent = report.days.reduce((sum, day) => sum + day.absentCount, 0);
  const daysWithAbsence = report.days.filter((day) => day.absentCount > 0).length;
  setFont(ctx, 14);
  ctx.fillText(
    `共 ${daysWithAbsence} 天有缺卡 · 累计 ${totalAbsent} 人次`,
    PADDING,
    y + 14
  );
  y += lineHeight(14) + 24;

  report.days.forEach((day) => {
    const hasAbsence = day.absentCount > 0;
    const cardX = PADDING;
    const cardW = CONTENT_WIDTH;

    setFont(ctx, 15);
    const detailLines = wrapText(ctx, dayDetailText(day), cardW - 24);
    const headerH = 44;
    const bodyH = detailLines.length * lineHeight(15) + 20;
    const cardH = headerH + bodyH;

    drawRoundRect(ctx, cardX, y, cardW, cardH, 10);
    ctx.fillStyle = COLORS.bg;
    ctx.fill();
    ctx.strokeStyle = hasAbsence ? COLORS.absentBorder : COLORS.border;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = hasAbsence ? COLORS.absentRowBg : COLORS.rowBg;
    ctx.fillRect(cardX + 1, y + 1, cardW - 2, headerH - 1);

    ctx.beginPath();
    ctx.moveTo(cardX, y + headerH);
    ctx.lineTo(cardX + cardW, y + headerH);
    ctx.strokeStyle = hasAbsence ? COLORS.absentBorder : COLORS.border;
    ctx.stroke();

    setFont(ctx, 16, "600");
    ctx.fillStyle = COLORS.text;
    ctx.fillText(`周${day.weekday} ${day.dateLabel}`, cardX + 12, y + 28);

    setFont(ctx, 13, hasAbsence ? "600" : "normal");
    ctx.fillStyle = hasAbsence ? COLORS.absent : COLORS.muted;
    const meta = dayMetaText(day);
    const metaW = ctx.measureText(meta).width;
    ctx.fillText(meta, cardX + cardW - 12 - metaW, y + 28);

    let textY = y + headerH + 18;
    setFont(ctx, 15);
    detailLines.forEach((line) => {
      if (line.startsWith("缺卡：")) {
        const label = "缺卡：";
        ctx.fillStyle = COLORS.muted;
        ctx.fillText(label, cardX + 12, textY);
        const labelW = ctx.measureText(label).width;
        ctx.fillStyle = hasAbsence ? COLORS.text : COLORS.muted;
        ctx.fillText(line.slice(label.length), cardX + 12 + labelW, textY);
      } else {
        ctx.fillStyle = COLORS.muted;
        ctx.fillText(line, cardX + 12, textY);
      }
      textY += lineHeight(15);
    });

    y += cardH + 12;
  });
}

export function renderWeekAbsenceCanvas(report) {
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  const height = measureReport(measureCtx, report);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  drawReport(ctx, report, height);

  return { canvas, height };
}

export function downloadWeekAbsenceImage(report) {
  return new Promise((resolve, reject) => {
    try {
      const { canvas } = renderWeekAbsenceCanvas(report);
      const startKey = report.days[0]?.dateKey || "week";
      const filename = `本周缺卡_${startKey}.png`;

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("图片生成失败"));
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        resolve(filename);
      }, "image/png");
    } catch (err) {
      reject(err);
    }
  });
}
