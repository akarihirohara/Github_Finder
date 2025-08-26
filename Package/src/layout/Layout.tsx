// =============================================
// 役割: 全ページ共通の枠。ナビゲーションとテーマ切替を提供
// =============================================
import { NavLink, Outlet, useLocation } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";                // テーマトグルボタン


export default function Layout() {
    const { pathname } = useLocation(); // 現在パスをヘッダーに表示（デバッグ用）
    return (
        <div>
            <header className="header">
                <div className="row">
                    <div className="brand">GitHub Finder</div>
                    <span className="badge">{pathname}</span>
                </div>
                <nav className="nav">
                    {/* NavLink はアクティブ時に .active クラスが付与される */}
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <ThemeToggle />
                </nav>
            </header>
            {/* 子ルートがここに描画される */}
            <main className="container">
                <Outlet />
            </main>
            <footer className="footer">© {new Date().getFullYear()} GitHub Finder</footer>
        </div>
    );
}