// =============================================
// 役割: 検索UIの司令塔。入力/検索/結果/状態管理（useState 版）
// Back To Search での保持は localStorage を利用
// =============================================
import { useEffect, useRef, useState } from "react";
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
    const [page, setPage] = useState(1); // 現在のページ番号
    const [hasMore, setHasMore] = useState(false); // 次のページがあるか判定


    // 初回：保存された検索語があれば自動検索
    useEffect(() => {
        if (!searchWord.trim()) return; // 空なら何もしない
        doSearch(searchWord);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 実際の検索処理（共通化）
    const doSearch = async (q: string, page = 1) => {
        if (!q.trim()) return;
        setStatus("loading");
        setError(null);

        if (page === 1) {
            localStorage.setItem(KEY, q);
        }

        cancelRef.current?.abort();
        const controller = new AbortController();
        cancelRef.current = controller;

        try {
            const items = await searchUsers(q, { signal: controller.signal, page });

            if (controller.signal.aborted || cancelRef.current !== controller) return;

            if (page === 1) {
                setSearchResult(items);
            } else {
                setSearchResult(prev => [...prev, ...items]);
            }

            // 👇 追加：30件返ってきたら「次もある」と判断
            setHasMore(items.length === 30);

            setStatus("success");
        } catch (e: any) {
            if (e?.name === "CanceledError" || e?.name === "AbortError") return;
            const code = e?.response?.status;
            if (code === 403 || code === 429) setError("Rate limiting in progress. Please wait a while and try again, or set up PAT.");
            else if (e?.request && !e?.response) setError("There is a network error. Please check your connection.");
            else setError("Search failed. Please try again.");
            setStatus("error");
        }
    };

    // フォーム送信時（Search ボタンまたは Enter）
    const handleSubmit = () => doSearch(searchWord);

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
                </div>
            )}
        </div>
    );
}