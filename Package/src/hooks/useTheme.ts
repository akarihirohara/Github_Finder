// =============================================
// 役割: ライト/ダークのテーマ状態を localStorage と <html data-theme> で管理
// =============================================
import { useEffect, useState } from "react";


type Mode = "light" | "dark";
const KEY = "ghf-theme";        // 保存キー


export default function useTheme() {
    // 初期値は localStorage から読み込み。なければ "light"
    const [mode, setMode] = useState<Mode>(() => {
        const m = (localStorage.getItem(KEY) as Mode | null) ?? "light";
        return m;
    });


    useEffect(() => {
        // HTML 要素の data-theme を切り替え → CSS 変数が反映される
        document.documentElement.setAttribute("data-theme", mode);
        localStorage.setItem(KEY, mode);                            // 選択を保存
    }, [mode]);


    return {
        mode,
        toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),   // トグル関数
        set: setMode,
    };
}