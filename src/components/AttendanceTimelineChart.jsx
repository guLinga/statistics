import { getPresentAtRecord, getAbsent, formatTime } from "../lib/attendance.js";

function TimelineNode({ record, people }) {
  const present = getPresentAtRecord(record, people);
  const absent = getAbsent(people, present);

  return (
    <div className="timeline-node">
      <span className="dot" />
      <div className="time-label">{record.time || ""}</div>
      <div className="event-label">{formatTime(record)}</div>
      <div className="people-list">
        {present.length > 0 && (
          <div className="row">
            出席：
            {present.map((n) => (
              <span key={n} className="tag present">
                {n}
              </span>
            ))}
          </div>
        )}
        {absent.length > 0 && (
          <div className="row">
            缺席：
            {absent.map((n) => (
              <span key={n} className="tag absent">
                {n}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AttendanceTimelineChart({ config }) {
  const people =
    config.people ||
    [
      ...new Set(
        (config.records || []).flatMap((r) => [
          ...getPresentAtRecord(r, []),
          ...(r.present || []),
          ...(r.absent || []),
        ])
      ),
    ].filter(Boolean);
  const records = config.records || [];

  return (
    <section className="chart-block">
      <div className="timeline-wrap timeline-wrap--attendance timeline-wrap--scroll">
        <div className="timeline">
          {records.length ? (
            records.map((record) => (
              <TimelineNode key={record.time} record={record} people={people} />
            ))
          ) : (
            <p className="empty-muted">暂无记录</p>
          )}
        </div>
      </div>
    </section>
  );
}
