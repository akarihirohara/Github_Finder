// =============================================
// 役割: 自己紹介などを表示する固定ページ
// =============================================
import profileImg from "../assets/my-icon.jpeg"; // 画像ファイルをインポート
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function About() {
  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>About</h2>
      {/* 👇 プロフィール画像 */}
      <img
        src={profileImg}
        alt="My Profile"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",       // 丸く切り抜き
          objectFit: "cover",
          marginBottom: "16px",
        }}
      />
      <p>Creator: Akari Hirohara</p>

      <p className="badge">
        This is a web application created during an internship at ST United.
      </p>

      {/* 👇 ここを追加 */}
      <p>
        <a
          href="https://github.com/akarihirohara" // ← あなたの GitHub ユーザー名に置き換えてください
          target="_blank"
          rel="noreferrer"
          className="button"
        >
        {/* 👇 GitHubアイコン */}
          <FontAwesomeIcon icon={faGithub} size="lg" />
          My GitHub Profile ↗
        </a>
      </p>
    </div>
  );
}
