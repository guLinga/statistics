import { useState } from "react";
import { useConfigs } from "../hooks/useConfigs.js";
import {
  createDutyRecord,
  updateDutyRecord,
  isConfigured,
} from "../api/supabase.js";
import ConfigPanel from "../components/ConfigPanel.jsx";
import DutyEditModal from "../components/DutyEditModal.jsx";
import { emptyDutyRecord } from "../api/dutyTransform.js";

export default function DutyPage() {
  const { dutyConfig, loading, error, refresh } = useConfigs();
  const [dutyEditContext, setDutyEditContext] = useState(null);

  const handleDutyEdit = (record) => {
    setDutyEditContext({ mode: "edit", record });
  };

  const handleDutyCreate = () => {
    setDutyEditContext({ mode: "create", record: emptyDutyRecord() });
  };

  const handleDutySave = async (formRecord) => {
    if (!isConfigured()) {
      throw new Error("Supabase 未配置，无法保存");
    }
    if (dutyEditContext?.mode === "create") {
      await createDutyRecord(formRecord);
    } else if (dutyEditContext?.record?.id) {
      await updateDutyRecord(dutyEditContext.record.id, formRecord);
    } else {
      await createDutyRecord(formRecord);
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
  if (!dutyConfig) {
    return <p className="load-error">暂无安排配置。</p>;
  }

  return (
    <>
      <ConfigPanel
        config={dutyConfig}
        onDutyEdit={isConfigured() ? handleDutyEdit : undefined}
        onDutyCreate={isConfigured() ? handleDutyCreate : undefined}
      />
      <DutyEditModal
        open={Boolean(dutyEditContext)}
        context={dutyEditContext}
        onClose={() => setDutyEditContext(null)}
        onSave={handleDutySave}
      />
    </>
  );
}
