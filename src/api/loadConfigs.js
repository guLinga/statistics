import {
  fetchAttendanceFromSupabase,
  fetchDutyFromSupabase,
  isConfigured,
} from "./supabase.js";

const loadJson = (url) =>
  fetch(url).then((res) => (res.ok ? res.json() : []));

const tagType = (list, type, sourceFile) =>
  (Array.isArray(list) ? list : []).map((item, sourceIndex) => ({
    ...item,
    type,
    sourceFile,
    sourceIndex,
  }));

const loadFromLocal = () =>
  Promise.all([loadJson("/config.json"), loadJson("/duty.json")]).then(
    ([attendance, duty]) => [
      ...tagType(attendance, "attendance", "config.json"),
      ...tagType(duty, "duty", "duty.json"),
    ]
  );

export const loadConfigs = async () => {
  const localConfigs = await loadFromLocal();
  const localAttendance = localConfigs.filter((c) => c.type === "attendance");
  const localDuty = localConfigs.filter((c) => c.type === "duty");

  if (!isConfigured()) {
    return localConfigs;
  }

  try {
    const [attendanceConfig, dutyConfig] = await Promise.all([
      fetchAttendanceFromSupabase().catch((err) => {
        console.warn("打卡数据加载失败", err);
        return null;
      }),
      fetchDutyFromSupabase().catch((err) => {
        console.warn("安排数据加载失败", err);
        return null;
      }),
    ]);

    const configs = [];
    configs.push(attendanceConfig || localAttendance[0]);
    configs.push(dutyConfig || localDuty[0]);
    return configs.filter(Boolean);
  } catch (err) {
    console.warn("Supabase 加载失败，回退本地 JSON", err);
    return localConfigs;
  }
};
