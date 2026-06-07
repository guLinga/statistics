import { getAllAtRecord, getDeleteAtRecord } from "./attendance.js";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 当前周周一至周日（本地时区） */
export function getCurrentWeekDateKeys(refDate = new Date()) {
  const base = new Date(refDate);
  base.setHours(0, 0, 0, 0);
  const day = base.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(base);
  monday.setDate(base.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return toDateKey(date);
  });
}

export function formatWeekRange(dateKeys) {
  if (!dateKeys.length) return "";
  const start = new Date(`${dateKeys[0]}T12:00:00`);
  const end = new Date(`${dateKeys[dateKeys.length - 1]}T12:00:00`);
  const sameYear = start.getFullYear() === end.getFullYear();
  const startStr = start.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const endStr = end.toLocaleDateString("zh-CN", {
    year: sameYear ? undefined : "numeric",
    month: "long",
    day: "numeric",
  });
  return `${startStr} — ${endStr}`;
}

export function buildWeekAbsenceReport(records = [], refDate = new Date()) {
  const weekDates = getCurrentWeekDateKeys(refDate);
  const recordByDate = new Map(
    records.map((record) => [String(record.time).slice(0, 10), record])
  );

  return {
    weekRange: formatWeekRange(weekDates),
    days: weekDates.map((dateKey) => {
      const record = recordByDate.get(dateKey);
      const date = new Date(`${dateKey}T12:00:00`);
      const absent = record ? getDeleteAtRecord(record) : [];
      const allCount = record ? getAllAtRecord(record).length : 0;

      return {
        dateKey,
        weekday: WEEKDAYS[date.getDay()],
        dateLabel: date.toLocaleDateString("zh-CN", {
          month: "long",
          day: "numeric",
        }),
        hasRecord: Boolean(record),
        absent,
        allCount,
        absentCount: absent.length,
      };
    }),
  };
}
