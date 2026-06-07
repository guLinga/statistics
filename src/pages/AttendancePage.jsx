import { useState } from "react";
import { useConfigs } from "../hooks/useConfigs.js";
import {
  createAttendanceRecord,
  updateAttendanceRecord,
} from "../api/supabase.js";
import ConfigPanel from "../components/ConfigPanel.jsx";
import EditModal, { emptyRecord } from "../components/EditModal.jsx";

export default function AttendancePage() {
  const { attendanceConfig, loading, error, refresh } = useConfigs();
  const [editContext, setEditContext] = useState(null);

  const handleEdit = ({ meta, record }) => {
    setEditContext({ mode: "edit", meta, record, originalTime: record.time });
  };

  const handleCreate = () => {
    setEditContext({ mode: "create", record: emptyRecord() });
  };

  const handleSave = async (formRecord) => {
    if (editContext?.mode === "create") {
      await createAttendanceRecord(formRecord);
    } else {
      if (!editContext?.record?.id) {
        throw new Error("当前记录来自本地 JSON，无法写入 Supabase");
      }
      await updateAttendanceRecord(editContext.record.id, formRecord);
    }
    await refresh();
  };

  if (loading) return <p className="empty-muted">加载中…</p>;
  if (error) {
    return (
      <>
        <p className="load-error">{error}</p>
        <p className="hint">
          在项目目录执行：<code>npm run dev</code>，然后访问开发服务器地址
        </p>
      </>
    );
  }
  if (!attendanceConfig) {
    return <p className="load-error">暂无打卡配置。</p>;
  }

  return (
    <>
      <ConfigPanel
        config={attendanceConfig}
        onEdit={handleEdit}
        onCreate={
          attendanceConfig.source === "supabase" ? handleCreate : undefined
        }
      />
      <EditModal
        open={Boolean(editContext)}
        context={editContext}
        onClose={() => setEditContext(null)}
        onSave={handleSave}
      />
    </>
  );
}
