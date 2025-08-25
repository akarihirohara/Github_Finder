import useTheme from "../hooks/useTheme";


export default function ThemeToggle() {
    const { mode, toggle } = useTheme();
    return (
        <button className="button ghost" onClick={toggle} aria-label="Toggle theme">
            {mode === "light" ? "🌞" : "🌙"}
        </button>
    );
}