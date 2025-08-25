import { Link } from "react-router-dom";


export type UserSummary = {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
};


type Props = {
    user: UserSummary; 
};


export default function UserCard({ user }: Props) {
    return (
        <article className="card">
            <div className="row">
                <img className="avatar" src={user.avatar_url} alt={`${user.login} avatar`} />
                <div>
                    <div style={{ fontWeight: 600 }}>{user.login}</div>
                    <a href={user.html_url} target="_blank" rel="noreferrer" className="badge">
                        Show GitHub Profile ↗
                    </a>
                </div>
            </div>
            <div style={{ marginTop: 12 }}>
                <Link className="button" to={`/user/${user.login}`}>More</Link>
            </div>
        </article>
    );
}