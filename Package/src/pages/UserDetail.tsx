import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRepos, getUser } from "../lib/github";
import RepoCard, { type Repo } from "../components/RepoCard";

type Status = "idle" | "loading" | "success" | "error";

type Profile = Awaited<ReturnType<typeof getUser>>;

export default function UserDetail() {
    const { login = "" } = useParams();
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [repos, setRepos] = useState<Repo[]>([]);
    const cancelRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!login) return;
        setStatus("loading");
        setError(null);

        cancelRef.current?.abort();
        const controller = new AbortController();
        cancelRef.current = controller;

        (async () => {
            try {
                const [u, r] = await Promise.all([
                    getUser(login, { signal: controller.signal }),
                    getRepos(login, { signal: controller.signal }),
                ]);
                if (controller.signal.aborted || cancelRef.current !== controller) return;
                setProfile(u);
                setRepos(r);
                setStatus("success");
            } catch (e: any) {
                if (e?.name === "CanceledError" || e?.name === "AbortError") return;
                const code = e?.response?.status;
                if (code === 404) setError("ユーザーが見つかりませんでした。");
                else if (code === 403 || code === 429) setError("レート制限中です。時間をおいて再試行してください。");
                else setError("読み込みに失敗しました。");
                setStatus("error");
            }
        })();

        return () => controller.abort();
    }, [login]);

    if (status === "loading") return <p className="badge">Loading…</p>;
    if (status === "error")
    return (
        <div className="card">
            <div style={{ marginBottom: 8 }}>⚠ {error}</div>
            <Link className="button" to="/">Back To Search</Link>
        </div>
    );

    if (!profile) return null;

    return (
        <div className="grid" style={{ gridTemplateColumns: "320px 1fr" }}>
            <aside className="card">
                <div className="row">
                    <img src={profile.avatar_url} alt="avatar" className="avatar" />
                    <div>
                        <div style={{ fontWeight: 700 }}>{profile.name ?? profile.login}</div>
                        <div className="badge">@{profile.login}</div>
                    </div>
                </div>
                {profile.bio && <p style={{ marginTop: 12 }}>{profile.bio}</p>}
                <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                    {profile.company && <div className="badge">🏢 {profile.company}</div>}
                    {profile.location && <div className="badge">📍 {profile.location}</div>}
                    {profile.blog && (
                        <a className="badge" href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer">🔗 {profile.blog}</a>
                    )}
                </div>
                <div className="row" style={{ marginTop: 12, gap: 12 }}>
                    <span className="badge">Followers: {profile.followers}</span>
                    <span className="badge">Following: {profile.following}</span>
                    <span className="badge">Public Repos: {profile.public_repos}</span>
                </div>
                <div style={{ marginTop: 12 }}>
                    <a className="button" href={profile.html_url} target="_blank" rel="noreferrer">Show GitHub Profile ↗</a>
                </div>
                <div style={{ marginTop: 12 }}>
                    <Link className="button" to="/">Back To Search</Link>
                </div>
            </aside>


            <section>
                <div className="section-title">Public Repositories</div>
                {repos.length === 0 && <p className="badge">公開リポジトリがありません。</p>}
                <div className="grid">
                    {repos.map((repo) => (
                        <RepoCard key={repo.id} repo={repo} />
                    ))}
                </div>
            </section>
        </div>
    );
}