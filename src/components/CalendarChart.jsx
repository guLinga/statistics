import {
  getAllAtRecord,
  getDeleteAtRecord,
  getWeekendSets,
  isWeekendPerson,
  formatDayHeader,
  calcEndAbsenceStreaks,
} from "../lib/attendance.js";
import DayPanel from "./DayPanel.jsx";

export default function CalendarChart({ config, onEdit, onCreate, onShowWeekAbsence }) {
  const people = (config.people || []).filter(Boolean);
  const records = [...(config.records || [])].sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );
  const endStreaks = calcEndAbsenceStreaks(people, records);
  const meta =
    config.configId != null
      ? { configId: config.configId }
      : config.sourceFile != null
        ? { sourceFile: config.sourceFile, sourceIndex: config.sourceIndex }
        : null;

  return (
    <section className="chart-block">
      <div className="calendar-toolbar">
        <div className="calendar-legend">
          <span className="legend-item">
            <span className="person-tile present legend-sample">样</span> 已打卡
          </span>
          <span className="legend-item">
            <span className="person-tile absent legend-sample">样</span> 缺席
          </span>
          <span className="legend-item legend-weekend">
            <span className="person-tile present weekend legend-sample">样</span>
            <span className="legend-label legend-label-short">右半蓝=周六/日参与 ｜ 左半绿=每日打卡</span>
          </span>
          <span className="legend-item legend-streak">
            <span className="legend-label legend-label-long">最后一日连续缺席</span>
            <span className="legend-label legend-label-short">连续缺席</span>{" "}
            <sup className="streak-badge inline">N</sup>
          </span>
        </div>
        {(onCreate || onShowWeekAbsence) && (
          <div className="calendar-actions">
            {onShowWeekAbsence && (
              <button
                type="button"
                className="btn-secondary"
                onClick={onShowWeekAbsence}
              >
                本周缺卡
              </button>
            )}
            {onCreate && (
              <button type="button" className="btn-create" onClick={onCreate}>
                新建
              </button>
            )}
          </div>
        )}
      </div>
      <div className="calendar-wrap calendar-wrap--attendance">
        <div className="day-panels">
          {records.length ? (
            records.map((record, index) => (
              <DayPanel
                key={record.id ?? record.time}
                record={record}
                endStreaks={index === 0 ? endStreaks : null}
                meta={meta}
                onEdit={onEdit}
              />
            ))
          ) : (
            <p className="empty-muted">暂无记录</p>
          )}
        </div>
      </div>
    </section>
  );
}
