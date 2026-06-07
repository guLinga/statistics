export const generateUuid = () => crypto.randomUUID();

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
