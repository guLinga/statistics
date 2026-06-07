export const parseDutyTime = (value, endOfDay = false) => {
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return endOfDay
      ? new Date(`${s}T23:59:59.999`)
      : new Date(`${s}T00:00:00`);
  }
  return new Date(s);
};

export const getDutyRange = (record) => {
  const t = record.time;
  if (!Array.isArray(t) || t.length < 2) return null;
  const start = parseDutyTime(t[0], false);
  const end = parseDutyTime(t[1], true);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return { start, end };
};

export const getDutyStatus = (record, now = new Date()) => {
  const range = getDutyRange(record);
  if (!range) return "pending";
  const n = now.getTime();
  const { start, end } = range;
  if (n < start.getTime()) return "pending";
  if (n <= end.getTime()) return "active";
  return "done";
};

export const dutyStatusLabel = {
  done: "执行完",
  active: "正在执行",
  pending: "未执行",
};

export const formatDutyTimeRange = (record) => {
  const t = record.time;
  if (!Array.isArray(t) || !t.length) return "";
  if (t.length === 1) return t[0];
  return `${t[0]} ~ ${t[1]}`;
};

export const sortRecords = (records) =>
  [...records].sort((a, b) => {
    const ra = getDutyRange(a);
    const rb = getDutyRange(b);
    const ta = ra ? ra.start.getTime() : 0;
    const tb = rb ? rb.start.getTime() : 0;
    return tb - ta;
  });
