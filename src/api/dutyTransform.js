import { parseJsonField, generateUuid } from "./transform.js";

export { generateUuid };

export const rowToDutyRecord = (row) => ({
  id: row.id,
  time: [row["time-start"], row["time-end"]].filter(Boolean),
  weekdayShare: parseJsonField(row.weekdayShare),
  checkIn: row.checkIn || "",
  checkInPublish: row.checkInPublish || "",
  saturday: {
    sing: row["saturday-sing"] || "",
    host: row["saturday-host"] || "",
  },
  sunday: {
    pray: row["saturday-pray"] || "",
    share: row["saturday-share"] || "",
    songs: parseJsonField(row["saturday-songs"]),
  },
});

export const dutyRecordToRow = (record) => ({
  ...(record.id != null ? { id: record.id } : {}),
  "time-start": record.time?.[0] || "",
  "time-end": record.time?.[1] || "",
  weekdayShare: JSON.stringify(record.weekdayShare || []),
  checkIn: record.checkIn || "",
  checkInPublish: record.checkInPublish || "",
  "saturday-sing": record.saturday?.sing || "",
  "saturday-host": record.saturday?.host || "",
  "saturday-pray": record.sunday?.pray || "",
  "saturday-share": record.sunday?.share || "",
  "saturday-songs": JSON.stringify(record.sunday?.songs || []),
});

export const rowsToDutyConfig = (rows, title = "安排") => ({
  title,
  type: "duty",
  source: "supabase",
  records: (rows || []).map(rowToDutyRecord),
});

export const normalizeSongs = (songs) =>
  [0, 1].map((i) => {
    const song = (songs || [])[i];
    if (typeof song === "string") return song.trim();
    return String(song?.name || song?.title || "").trim();
  });

export const emptyDutyRecord = () => ({
  time: [],
  weekdayShare: [],
  checkIn: "",
  checkInPublish: "",
  saturday: { sing: "", host: "" },
  sunday: { pray: "", share: "", songs: [{ name: "" }, { name: "" }] },
});
