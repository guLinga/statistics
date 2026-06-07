import { namesToText, parseNameList } from "../lib/attendance.js";
import { useState } from "react";

const emptyRecord = () => ({
  time: new Date().toISOString().slice(0, 10),
  all: [],
  delete: [],
  saturday: [],
  sunday: [],
});

export default function EditModal({ open, context, onClose, onSave }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open || !context) return null;

  const isCreate = context.mode === "create";
  const record = context.record || emptyRecord();
  const form = {
    time: record.time || "",
    all: namesToText(record.all),
    delete: namesToText(record.delete),
    saturday: namesToText(record.saturday),
    sunday: namesToText(record.sunday),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const fd = new FormData(e.target);
    const payload = {
      time: fd.get("time"),
      all: parseNameList(fd.get("all")),
      delete: parseNameList(fd.get("delete")),
      saturday: parseNameList(fd.get("saturday")),
      sunday: parseNameList(fd.get("sunday")),
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
        <h3>{isCreate ? "新建打卡记录" : "编辑打卡记录"}</h3>
        <label>
          <span>日期</span>
          <input type="date" name="time" defaultValue={form.time} required />
        </label>
        <label>
          <span>全部人员，每行一个或逗号分隔</span>
          <textarea name="all" defaultValue={form.all} />
        </label>
        <label>
          <span>缺席</span>
          <textarea name="delete" defaultValue={form.delete} />
        </label>
        <label>
          <span>周六参与</span>
          <textarea name="saturday" defaultValue={form.saturday} />
        </label>
        <label>
          <span>周日参与</span>
          <textarea name="sunday" defaultValue={form.sunday} />
        </label>
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

export { emptyRecord };
