export const trimPresent = (list) =>
  list.filter((name) => String(name).trim() !== "");

export const getAllAtRecord = (record) => trimPresent(record.all || []);
export const getDeleteAtRecord = (record) => trimPresent(record.delete || []);

export const isCalendarConfig = (config) =>
  config.source === "supabase" ||
  (config.records || []).some((r) => Array.isArray(r.all));

export const getPresentAtRecord = (record, people) => {
  if (Array.isArray(record.all)) {
    const del = new Set(getDeleteAtRecord(record));
    return getAllAtRecord(record).filter((name) => !del.has(name));
  }
  if (Array.isArray(record.present)) return trimPresent(record.present);
  if (Array.isArray(record.absent))
    return people.filter((name) => !record.absent.includes(name));
  return [];
};

export const getAbsent = (people, present) =>
  people.filter((name) => !present.includes(name));

export const calcEndAbsenceStreaks = (people, records) => {
  const sorted = [...records].sort(
    (a, b) => new Date(a.time) - new Date(b.time)
  );
  const names = people.length
    ? people
    : [...new Set(sorted.flatMap((r) => getAllAtRecord(r)))];
  const current = new Map(names.map((name) => [name, 0]));
  sorted.forEach((record) => {
    const all = getAllAtRecord(record);
    const del = new Set(getDeleteAtRecord(record));
    names.forEach((name) => {
      if (!all.includes(name)) return;
      current.set(name, del.has(name) ? current.get(name) + 1 : 0);
    });
  });
  return new Map([...current.entries()].filter(([, streak]) => streak > 0));
};

export const getWeekendSets = (record) => ({
  saturday: new Set(trimPresent(record.saturday || [])),
  sunday: new Set(trimPresent(record.sunday || [])),
});

export const isWeekendPerson = (name, weekend) =>
  weekend.saturday.has(name) || weekend.sunday.has(name);

export const formatDayHeader = (record) => {
  const d = new Date(record.time);
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return {
    weekday: weekdays[d.getDay()],
    dateStr: d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
};

export const namesToText = (list) => (Array.isArray(list) ? list : []).join("\n");

export const parseNameList = (text) =>
  trimPresent(
    String(text)
      .split(/[\n,，、]/)
      .map((s) => s.trim())
  );

export const formatTime = (record) =>
  record.time
    ? new Date(record.time).toLocaleDateString("zh-CN", {
        month: "numeric",
        day: "numeric",
      })
    : "—";
