import { NavLink, Outlet, useLocation } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";


export default function Layout() {
    const { pathname } = useLocation();
    return (
        <div>
            <header className="header">
                <div className="row">
                    <div className="brand">GitHub Finder</div>
                    <span className="badge">{pathname}</span>
                </div>
                <nav className="nav">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <ThemeToggle />
                </nav>
            </header>
            <main className="container">
                <Outlet />
            </main>
            <footer className="footer">© {new Date().getFullYear()} GitHub Finder</footer>
        </div>
    );
}