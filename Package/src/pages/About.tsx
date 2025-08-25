export default function About() {
    return (
        <div className="card">
            <h2 style={{ marginTop: 0 }}>About</h2>
            <p>
                作成者: あなたの名前（例: Akari Hirohara）
            </p>
            <p className="badge">フロントエンド学習中。React + TypeScript / Vite / Netlify デプロイの練習用アプリです。</p>
            <p className="badge">必要に応じて、自己紹介や連絡先、アバター画像などを追記してください。</p>
        </div>
    );
}