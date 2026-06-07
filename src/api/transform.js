export const generateUuid = () => {
  if (typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto?.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = (Math.random() * 256) | 0;
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const parseJsonField = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value == null || value === "") return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const rowToRecord = (row) => ({
  id: row.id,
  time: row.time,
  all: parseJsonField(row.all),
  delete: parseJsonField(row.delete),
  saturday: parseJsonField(row.saturday),
  sunday: parseJsonField(row.sunday),
});

export const recordToRow = (record) => ({
  ...(record.id != null ? { id: record.id } : {}),
  time: record.time,
  all: JSON.stringify(record.all || []),
  delete: JSON.stringify(record.delete || []),
  saturday: JSON.stringify(record.saturday || []),
  sunday: JSON.stringify(record.sunday || []),
});

export const rowsToAttendanceConfig = (rows, title = "每日读经打卡及周六日上线") => {
  const records = (rows || [])
    .map(rowToRecord)
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  return {
    title,
    type: "attendance",
    source: "supabase",
    records,
  };
};
