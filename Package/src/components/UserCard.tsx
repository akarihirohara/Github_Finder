// =============================================
// 役割: 検索結果の1ユーザーをカード表示。More で詳細へ
// =============================================
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
                {/* アバターとユーザー名 */}
                <img className="avatar" src={user.avatar_url} alt={`${user.login} avatar`} />
                <div>
                    <div style={{ fontWeight: 600 }}>{user.login}</div>
                    {/* GitHub の外部プロフィールへ */}
                    <a href={user.html_url} target="_blank" rel="noreferrer" className="badge">
                        Show GitHub Profile ↗
                    </a>
                </div>
            </div>
            {/* 詳細ページへ遷移（/user/:login） */}
            <div style={{ marginTop: 12 }}>
                <Link className="button" to={`/user/${user.login}`}>More</Link>
            </div>
        </article>
    );
}