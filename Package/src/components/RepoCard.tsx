// =============================================
// 役割: リポジトリ1件のカード表示
// =============================================
export type Repo = {
    id: number;
    name: string;
    description: string | null;
    stargazers_count: number;   // スター数
    forks_count: number;        // フォーク数
    html_url: string;           // リポジトリページ
    language: string | null;    // 主言語
    updated_at: string;         // 更新日
};


type Props = { repo: Repo };


export default function RepoCard({ repo }: Props) {
    return (
        <article className="card">
            <div className="row" style={{ justifyContent: "space-between" }}>
                {/* リポジトリ名（外部リンク） */}
                <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
                    {repo.name}
                </a>
                <span className="badge">★ {repo.stargazers_count} ・ ⑂ {repo.forks_count}</span>
            </div>
            {/* 説明文（あれば表示） */}
            {repo.description && (
                <p style={{ marginTop: 8, marginBottom: 8, color: "var(--muted)" }}>{repo.description}</p>
            )}
            <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="badge">{repo.language ?? ""}</span>
                <span className="badge">Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
            </div>
        </article>
    );
}