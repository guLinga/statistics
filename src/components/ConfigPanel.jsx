import { isCalendarConfig } from "../lib/attendance.js";
import CalendarChart from "./CalendarChart.jsx";
import AttendanceTimelineChart from "./AttendanceTimelineChart.jsx";
import DutyChart from "./DutyChart.jsx";

export default function ConfigPanel({
  config,
  onEdit,
  onCreate,
  onShowWeekAbsence,
  onDutyEdit,
  onDutyCreate,
}) {
  if (config.type === "duty") {
    return (
      <DutyChart config={config} onEdit={onDutyEdit} onCreate={onDutyCreate} />
    );
  }
  if (isCalendarConfig(config)) {
    return (
      <CalendarChart
        config={config}
        onEdit={onEdit}
        onCreate={onCreate}
        onShowWeekAbsence={onShowWeekAbsence}
      />
    );
  }
  return <AttendanceTimelineChart config={config} />;
}
