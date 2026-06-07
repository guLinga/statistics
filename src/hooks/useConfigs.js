import { useCallback, useEffect, useState } from "react";
import { loadConfigs } from "../api/loadConfigs.js";

export function useConfigs() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(
    () =>
      loadConfigs().then((data) => {
        setConfigs(data);
        return data;
      }),
    []
  );

  useEffect(() => {
    refresh()
      .then(() => setLoading(false))
      .catch(() => {
        setError("无法加载配置文件。");
        setLoading(false);
      });
  }, [refresh]);

  const attendanceConfig = configs.find((c) => c.type !== "duty");
  const dutyConfig = configs.find((c) => c.type === "duty");

  return { configs, attendanceConfig, dutyConfig, loading, error, refresh };
}
