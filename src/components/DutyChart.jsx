import { trimPresent } from "../lib/attendance.js";
import {
  getDutyStatus,
  dutyStatusLabel,
  formatDutyTimeRange,
  sortRecords,
} from "../lib/duty.js";

function formatTagValue(value) {
  const text = String(value ?? "").trim();
  return text ? <span className="tag role">{text}</span> : "—";
}

function formatTagList(value) {
  const names = trimPresent(
    String(value ?? "")
      .split(/[\n,，、]/)
      .map((s) => s.trim())
  );
  return names.length ? (
    names.map((n) => (
      <span key={n} className="tag role">
        {n}
      </span>
    ))
  ) : (
    "—"
  );
}

function formatSongTags(songs) {
  const list = []
    .concat(songs || [])
    .map((song) =>
      typeof song === "string"
        ? song.trim()
        : String(song.name || song.title || "").trim()
    )
    .filter(Boolean);
  return list.length ? (
    list.map((name, i) => (
      <span key={`${i}-${name}`} className="tag role">
        {name}
      </span>
    ))
  ) : (
    "—"
  );
}

function formatSaturday(saturday = {}) {
  return (
    <>
      <div>唱歌：{formatTagValue(saturday.sing)}</div>
      <div className="duty-sub-row">主持：{formatTagValue(saturday.host)}</div>
    </>
  );
}

function formatSunday(sunday = {}) {
  return (
    <>
      <div>祷告：{formatTagList(sunday.pray)}</div>
      <div className="duty-sub-row">分享：{formatTagValue(sunday.share)}</div>
      <div className="duty-sub-row">
        <span className="slot-inline-title">歌曲</span>
        {formatSongTags(sunday.songs)}
      </div>
    </>
  );
}

function formatWeekdayShare(list) {
  const names = trimPresent([].concat(list || []));
  return names.length ? (
    names.map((n) => (
      <span key={n} className="tag role">
        {n}
      </span>
    ))
  ) : (
    "—"
  );
}

function formatCheckIn(name) {
  const n = String(name ?? "").trim();
  return n ? <span className="tag role">{n}</span> : "—";
}

function DutyNode({ record, onEdit }) {
  const status = getDutyStatus(record);
  const dotClass =
    status === "done"
      ? "dot-done"
      : status === "active"
        ? "dot-active"
        : "dot-pending";
  const canEdit = Boolean(onEdit);

  return (
    <div className="timeline-node duty-node">
      <span className={`dot ${dotClass}`} />
      {canEdit && (
        <button
          type="button"
          className="duty-edit-btn"
          onClick={() => onEdit(record)}
        >
          编辑
        </button>
      )}
      <div className="time-label">{formatDutyTimeRange(record)}</div>
      <span className={`status-badge ${status}`}>{dutyStatusLabel[status]}</span>
      <div className="people-list">
        <div className="duty-slot">
          <span className="slot-title">周内分享（两天内）</span>
          {formatWeekdayShare(record.weekdayShare)}
        </div>
        <div className="duty-slot">
          <span className="slot-title">每周打卡</span>
          <div>督促：{formatCheckIn(record.checkIn)}</div>
          <div className="duty-sub-row">
            任务发布：{formatCheckIn(record.checkInPublish)}
          </div>
        </div>
        <div className="duty-slot">
          <span className="slot-title">周六</span>
          {formatSaturday(record.saturday)}
        </div>
        <div className="duty-slot">
          <span className="slot-title">周日</span>
          {formatSunday(record.sunday)}
        </div>
      </div>
    </div>
  );
}

export default function DutyChart({ config, onEdit, onCreate }) {
  const sorted = sortRecords(config.records || []);
  const countBy = (status) =>
    sorted.filter((r) => getDutyStatus(r) === status).length;

  return (
    <section className="chart-block">
      <div className="duty-toolbar">
        <p className="duty-summary">
          执行完 <strong>{countBy("done")}</strong> · 正在执行{" "}
          <strong>{countBy("active")}</strong> · 未执行{" "}
          <strong>{countBy("pending")}</strong>
        </p>
        {onCreate && (
          <button type="button" className="btn-create" onClick={onCreate}>
            新建
          </button>
        )}
      </div>
      <div className="timeline-wrap">
        <div className="timeline">
          {sorted.length ? (
            sorted.map((record) => (
              <DutyNode
                key={record.id ?? record.time?.join("-")}
                record={record}
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
