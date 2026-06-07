import { useState } from "react";
import { parseNameList, namesToText } from "../lib/attendance.js";
import { normalizeSongs } from "../api/dutyTransform.js";

export default function DutyEditModal({ open, context, onClose, onSave }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open || !context) return null;

  const isCreate = context.mode === "create";
  const record = context.record;
  const songs = normalizeSongs(record.sunday?.songs);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const fd = new FormData(e.target);
    const payload = {
      time: [fd.get("timeStart"), fd.get("timeEnd")].filter(Boolean),
      weekdayShare: parseNameList(fd.get("weekdayShare")),
      checkIn: String(fd.get("checkIn") || "").trim(),
      checkInPublish: String(fd.get("checkInPublish") || "").trim(),
      saturday: {
        sing: String(fd.get("saturdaySing") || "").trim(),
        host: String(fd.get("saturdayHost") || "").trim(),
      },
      sunday: {
        pray: parseNameList(fd.get("sundayPray")).join("、"),
        share: parseNameList(fd.get("sundayShare")).join("、"),
        songs: [0, 1].map((i) => ({
          name: String(fd.get(`songName${i}`) || "").trim(),
        })),
      },
    };
    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay open"
      aria-hidden="false"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <form
        className="modal-box"
        onSubmit={handleSubmit}
        key={isCreate ? "create" : record.id}
      >
        <h3>{isCreate ? "新建安排" : "编辑安排"}</h3>
        <label>
          <span>开始日期</span>
          <input
            type="date"
            name="timeStart"
            defaultValue={record.time?.[0] || ""}
            required
          />
        </label>
        <label>
          <span>结束日期</span>
          <input
            type="date"
            name="timeEnd"
            defaultValue={record.time?.[1] || ""}
            required
          />
        </label>
        <label>
          <span>周内分享，每行一个</span>
          <textarea
            name="weekdayShare"
            defaultValue={namesToText(record.weekdayShare)}
          />
        </label>
        <label>
          <span>督促打卡</span>
          <input name="checkIn" defaultValue={record.checkIn || ""} />
        </label>
        <label>
          <span>发布打卡任务</span>
          <input
            name="checkInPublish"
            defaultValue={record.checkInPublish || ""}
          />
        </label>
        <label>
          <span>周六唱歌</span>
          <input
            name="saturdaySing"
            defaultValue={record.saturday?.sing || ""}
          />
        </label>
        <label>
          <span>周六主持</span>
          <input
            name="saturdayHost"
            defaultValue={record.saturday?.host || ""}
          />
        </label>
        <label>
          <span>周日祷告，每行一个或逗号分隔</span>
          <textarea
            name="sundayPray"
            defaultValue={namesToText(parseNameList(record.sunday?.pray || ""))}
          />
        </label>
        <label>
          <span>周日分享，每行一个或逗号分隔</span>
          <textarea
            name="sundayShare"
            defaultValue={namesToText(parseNameList(record.sunday?.share || ""))}
          />
        </label>
        <fieldset className="modal-fieldset">
          <legend>周日歌曲</legend>
          {songs.map((name, i) => (
            <label key={i}>
              <span>歌曲 {i + 1}</span>
              <input name={`songName${i}`} defaultValue={name} />
            </label>
          ))}
        </fieldset>
        {error && <p className="modal-error">{error}</p>}
        <div className="modal-actions">
          <button type="button" onClick={onClose} disabled={saving}>
            取消
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "保存中…" : "保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
