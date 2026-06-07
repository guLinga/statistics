import { useState } from "react";
import { buildWeekAbsenceReport } from "../lib/weekAbsence.js";
import { downloadWeekAbsenceImage } from "../lib/weekAbsenceImage.js";

function DayAbsenceRow({ day }) {
  let detail = null;
  if (!day.hasRecord) {
    detail = <p className="empty-muted">当日暂无打卡记录</p>;
  } else if (day.absentCount === 0) {
    detail = <p className="empty-muted">全员已打卡</p>;
  } else {
    detail = (
      <p className="week-absence-names">
        <span className="week-absence-label">缺卡：</span>
        {day.absent.join("、")}
      </p>
    );
  }

  return (
    <article
      className={`week-absence-day${day.absentCount > 0 ? " has-absence" : ""}${!day.hasRecord ? " no-record" : ""}`}
    >
      <div className="week-absence-day-row">
        <div className="week-absence-day-title">
          <span className="week-absence-weekday">周{day.weekday}</span>
          <span className="week-absence-date">{day.dateLabel}</span>
        </div>
        <span className="week-absence-meta">
          {!day.hasRecord
            ? "无记录"
            : day.absentCount === 0
              ? "全员已打卡"
              : `${day.absentCount} 人缺卡`}
        </span>
      </div>
      <div className="week-absence-detail">{detail}</div>
    </article>
  );
}

export default function WeekAbsenceModal({ open, config, onClose }) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!open || !config) return null;

  const report = buildWeekAbsenceReport(config.records || []);
  const totalAbsent = report.days.reduce((sum, day) => sum + day.absentCount, 0);
  const daysWithAbsence = report.days.filter((day) => day.absentCount > 0).length;

  const handleSaveImage = async () => {
    setSaveError("");
    setSaving(true);
    try {
      await downloadWeekAbsenceImage(report);
    } catch (err) {
      setSaveError(err.message || "保存图片失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay modal-overlay--week-absence open"
      aria-hidden="false"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-box week-absence-modal"
        role="dialog"
        aria-labelledby="week-absence-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="week-absence-header">
          <div>
            <h3 id="week-absence-title">本周缺卡</h3>
            <p className="week-absence-range">{report.weekRange}</p>
          </div>
          <p className="week-absence-summary">
            共 <strong>{daysWithAbsence}</strong> 天有缺卡 · 累计{" "}
            <strong>{totalAbsent}</strong> 人次
          </p>
        </header>
        <div className="week-absence-list">
          {report.days.map((day) => (
            <DayAbsenceRow key={day.dateKey} day={day} />
          ))}
        </div>
        {saveError && <p className="modal-error">{saveError}</p>}
        <div className="modal-actions week-absence-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleSaveImage}
            disabled={saving}
          >
            {saving ? "生成中…" : "保存图片"}
          </button>
          <button type="button" className="btn-primary" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
