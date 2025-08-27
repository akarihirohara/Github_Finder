// =============================================
// 役割: 検索UIの司令塔。入力/検索/結果/状態管理（useState 版）
// Back To Search での保持は localStorage を利用
// =============================================
import { useRef, useState } from "react";
import SearchForm from "../components/SearchForm";
import UserCard, { type UserSummary } from "../components/UserCard";
import { searchUsers } from "../lib/github";

const KEY = "ghf-last-query";   // 直近の検索語を保存するキー

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
    // 初期値は localStorage から読み込み。リロードしても直近の語が復元される
    const [searchWord, setSearchWord] = useState<string>(() => localStorage.getItem(KEY) ?? "");
    const [searchResult, setSearchResult] = useState<UserSummary[]>([]); // 検索結果一覧
    const [status, setStatus] = useState<Status>("idle"); // 表示状態
    const [error, setError] = useState<string | null>(null); // エラーメッセージ
    const cancelRef = useRef<AbortController | null>(null); // 直近リクエストのキャンセル用
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0); // state に total を追加

    const PER_PAGE = 30;

    const doSearch = async (q: string, pageArg = 1) => {
        if (!q.trim()) return;
        setStatus("loading");
        setError(null);
        if (pageArg === 1) localStorage.setItem(KEY, q);

        cancelRef.current?.abort();
        const controller = new AbortController();
        cancelRef.current = controller;

        try {
            const { items, total } = await searchUsers(q, { signal: controller.signal, page: pageArg });
            if (controller.signal.aborted || cancelRef.current !== controller) return;

            if (pageArg === 1) setSearchResult(items);
            else setSearchResult(prev => [...prev, ...items]);

            setTotal(Math.min(total, 1000)); // GitHubは検索の上限1000件
            // ★「今表示している件数 < 合計」なら まだ続きがある
            const shown = (pageArg) * PER_PAGE;
            setHasMore(shown < Math.min(total, 1000) && items.length > 0);

            setStatus("success");
        } catch (e: any) {
            if (e?.name === "CanceledError" || e?.name === "AbortError") return;
            const code = e?.response?.status;
            if (code === 403 || code === 429) setError("レート制限中です。時間をおいて再試行するか、PAT を設定してください。");
            else if (e?.request && !e?.response) setError("ネットワークエラーです。接続を確認してください。");
            else setError("検索に失敗しました。もう一度お試しください。");
            setStatus("error");
        }
    };


    // フォーム送信時（Search ボタンまたは Enter）
    const handleSubmit = () => {
        setPage(1);                // ★ ここを追加
        doSearch(searchWord, 1);   // ★ doSearch にも page=1 を渡す
    };

    // クリア処理：入力/結果/状態を初期化し、保存も削除
    const handleClear = () => {
        setSearchWord("");
        setSearchResult([]);
        setStatus("idle");
        setError(null);
        localStorage.removeItem(KEY);
    };

    return (
        <div>
            {/* 検索フォーム。Home は状態のオーケストレーションに専念 */}
            <SearchForm
                value={searchWord}
                loading={status === "loading"}
                onChange={setSearchWord}
                onSubmit={handleSubmit}
                onClear={handleClear}
            />
            {/* 状態に応じた表示の切り替え */}
            {status === "idle" && <p className="badge">Please enter a username to search.</p>}
            {status === "loading" && <p className="badge">Searching…</p>}
            {status === "error" && (
                <div className="card">
                    <div style={{ marginBottom: 8 }}>⚠ {error}</div>
                    <button className="button" onClick={handleSubmit}>Retry</button>
                </div>
            )}
            {status === "success" && searchResult.length === 0 && (
                <p className="badge">No matching users found.</p>
            )}

            {/* 検索結果のグリッド */}
            {searchResult.length > 0 && (
                <div>
                    <div className="section-title">Results</div>
                    <div className="results-grid">
                        {searchResult.map((u) => (
                            <UserCard key={u.id} user={u} />
                        ))}
                    </div>
                </div>
            )}
            {status === "success" && hasMore && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <button
                        className="button"
                        onClick={() => {
                            const next = page + 1;
                            setPage(next);
                            doSearch(searchWord, next);
                        }}
                    >
                        Show More
                    </button>
                    {/* ここで total を読む（例: 60 / 178 results） */}
                    <p className="badge" style={{ marginTop: 8 }}>
                        {Math.min(page * 30, total)} / {total} results
                    </p>
                </div>
            )}
        </div>
    );
}