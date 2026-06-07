import { createClient } from "@supabase/supabase-js";
import {
  rowsToAttendanceConfig,
  recordToRow,
  rowToRecord,
  generateUuid,
} from "./transform.js";

import {
  rowsToDutyConfig,
  dutyRecordToRow,
  rowToDutyRecord,
  generateUuid as generateDutyUuid,
} from "./dutyTransform.js";

const SUPABASE_TABLE = "statistics";
const DUTY_TABLE = "statistics-duty";
const DUTY_SELECT =
  'id, "time-start", "time-end", weekdayShare, checkIn, checkInPublish, "saturday-sing", "saturday-host", "saturday-pray", "saturday-share", "saturday-songs"';
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://vejrxallaphmthqgdzin.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_ozY-bUPbzU8xV6fsaIeDig_yL_u-FDI";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isConfigured = () => Boolean(supabaseUrl && supabaseKey);

export const fetchAttendanceFromSupabase = async () => {
  if (!isConfigured()) return null;

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .select("id, time, all, delete, saturday, sunday")
    .order("time", { ascending: false });

  if (error) throw error;

  return rowsToAttendanceConfig(data || []);
};

export async function createAttendanceRecord(record) {
  const payload = recordToRow({ ...record, id: generateUuid() });

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .insert(payload)
    .select("id, time, all, delete, saturday, sunday")
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return rowToRecord(data);
}

export async function updateAttendanceRecord(recordId, record) {
  const payload = recordToRow(record);

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .update(payload)
    .eq("id", recordId)
    .select("id, time, all, delete, saturday, sunday")
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return rowToRecord(data);
}

export const fetchDutyFromSupabase = async () => {
  if (!isConfigured()) return null;

  const { data, error } = await supabase
    .from(DUTY_TABLE)
    .select(DUTY_SELECT)
    .order("time-start", { ascending: false });

  if (error) throw error;

  return rowsToDutyConfig(data || []);
};

export async function updateDutyRecord(recordId, record) {
  const payload = dutyRecordToRow(record);

  const { data, error } = await supabase
    .from(DUTY_TABLE)
    .update(payload)
    .eq("id", recordId)
    .select(DUTY_SELECT)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return rowToDutyRecord(data);
}

export async function createDutyRecord(record) {
  const payload = dutyRecordToRow({ ...record, id: generateDutyUuid() });

  const { data, error } = await supabase
    .from(DUTY_TABLE)
    .insert(payload)
    .select(DUTY_SELECT)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return rowToDutyRecord(data);
}
