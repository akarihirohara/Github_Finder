// =============================================
// 役割: ライト/ダークのテーマ状態を localStorage と <html data-theme> で管理
// =============================================
import { useEffect, useState } from "react";

type Mode = "light" | "dark";
const KEY = "ghf-theme";
const KEY_LOCK = "ghf-theme-lock"; // "1" のときだけユーザー固定

export default function useTheme() {
  const getSystem = () =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem(KEY) as Mode | null;
    const locked = localStorage.getItem(KEY_LOCK) === "1";
    // ★ ここがポイント：ロックされていなければ OS を優先（過去の保存値は無視）
    return locked && saved ? saved : getSystem();
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  // OS変更に追従（ユーザー固定が無い場合のみ）
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const locked = localStorage.getItem(KEY_LOCK) === "1";
      if (!locked) setMode(mql.matches ? "dark" : "light");
    };
    mql.addEventListener?.("change", handler) ?? mql.addListener(handler);
    return () => mql.removeEventListener?.("change", handler) ?? mql.removeListener(handler);
  }, []);

  return {
    mode,
    toggle: () => {
      setMode((m) => {
        const next = m === "light" ? "dark" : "light";
        localStorage.setItem(KEY, next);
        localStorage.setItem(KEY_LOCK, "1"); // 手動切替＝固定
        return next;
      });
    },
    // 「OSに合わせる」に戻すAPI（任意でボタンに）
    followSystem: () => {
      localStorage.removeItem(KEY);
      localStorage.removeItem(KEY_LOCK);
      setMode(getSystem());
    },
  };
}
