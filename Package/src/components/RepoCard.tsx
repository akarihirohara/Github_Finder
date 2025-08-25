export type Repo = {
    id: number;
    name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    html_url: string;
    language: string | null;
    updated_at: string;
};


type Props = {
repo: Repo;
};


export default function RepoCard({ repo }: Props) {
    return (
        <article className="card">
            <div className="row" style={{ justifyContent: "space-between" }}>
                <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
                    {repo.name}
                </a>
                <span className="badge">★ {repo.stargazers_count} ・ ⑂ {repo.forks_count}</span>
            </div>
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