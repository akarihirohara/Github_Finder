import { useEffect, useState } from "react";


type Mode = "light" | "dark";
const KEY = "ghf-theme";


export default function useTheme() {
    const [mode, setMode] = useState<Mode>(() => {
        const m = (localStorage.getItem(KEY) as Mode | null) ?? "light";
        return m;
    });


    useEffect(() => {
        document.documentElement.setAttribute("data-theme", mode);
        localStorage.setItem(KEY, mode);
    }, [mode]);


    return {
        mode,
        toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
        set: setMode,
    };
}