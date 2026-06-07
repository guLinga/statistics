import {
  getAllAtRecord,
  getDeleteAtRecord,
  getWeekendSets,
  isWeekendPerson,
  formatDayHeader,
} from "../lib/attendance.js";

export default function DayPanel({ record, endStreaks, meta, onEdit }) {
  const all = getAllAtRecord(record);
  const deleteSet = new Set(getDeleteAtRecord(record));
  const weekend = getWeekendSets(record);
  const { weekday, dateStr } = formatDayHeader(record);
  const presentCount = all.filter((n) => !deleteSet.has(n)).length;
  const absentCount = all.filter((n) => deleteSet.has(n)).length;

  const canEdit = Boolean(onEdit && (record.id != null || meta));

  const handleEdit = () => {
    if (!canEdit) return;
    onEdit({ meta, record });
  };

  return (
    <article className="day-panel">
      <header className="day-header">
        {canEdit && (
          <button type="button" className="day-edit-btn" onClick={handleEdit}>
            编辑
          </button>
        )}
        <div className="day-week">周{weekday}</div>
        <div className="day-date">{dateStr}</div>
      </header>
      <div className="day-people-grid">
        {all.length ? (
          all.map((name) => {
            const status = deleteSet.has(name) ? "absent" : "present";
            const streak = endStreaks?.get(name) || 0;
            const weekendFlag = isWeekendPerson(name, weekend);
            const parts = [status === "present" ? "已打卡" : "缺席"];
            if (weekend.saturday.has(name)) parts.push("周六参与");
            if (weekend.sunday.has(name)) parts.push("周日参与");
            if (streak > 0) parts.push(`连续缺席 ${streak} 天`);
            return (
              <div
                key={name}
                className={`person-tile ${status}${weekendFlag ? " weekend" : ""}`}
                title={parts.join("，")}
              >
                <span className="person-name">{name}</span>
                {status === "absent" && streak > 0 && (
                  <sup className="streak-badge">{streak}</sup>
                )}
              </div>
            );
          })
        ) : (
          <span className="empty-muted">暂无人员</span>
        )}
      </div>
      <footer className="day-footer">
        已打卡 {presentCount} · 缺席 {absentCount}
      </footer>
    </article>
  );
}
