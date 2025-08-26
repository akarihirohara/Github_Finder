// =============================================
// 役割: テーマの切り替えボタン。useTheme を利用
// =============================================
import useTheme from "../hooks/useTheme";


export default function ThemeToggle() {
    const { mode, toggle } = useTheme();
    return (
        <button className="button ghost" onClick={toggle} aria-label="Toggle theme">
            {/* 視覚的なフィードバックとしてアイコンを出し分け */}
            {mode === "light" ? "Light Mode" : "Dark Mode"}
        </button>
    );
}