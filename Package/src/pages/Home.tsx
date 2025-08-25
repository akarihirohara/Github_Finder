import { useEffect, useRef, useState } from "react";
import SearchForm from "../components/SearchForm";
import UserCard, { type UserSummary } from "../components/UserCard";
import { searchUsers } from "../lib/github";

const KEY = "ghf-last-query";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
    const [searchWord, setSearchWord] = useState<string>(() => localStorage.getItem(KEY) ?? "");
    const [searchResult, setSearchResult] = useState<UserSummary[]>([]);
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const cancelRef = useRef<AbortController | null>(null);


    // 初回：保存された検索語があれば自動検索
    useEffect(() => {
        if (!searchWord.trim()) return;
        doSearch(searchWord);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const doSearch = async (q: string) => {
        if (!q.trim()) return;
        setStatus("loading");
        setError(null);
        localStorage.setItem(KEY, q);


        // 前回リクエストをキャンセル
        cancelRef.current?.abort();
        const controller = new AbortController();
        cancelRef.current = controller;


        try {
            const items = await searchUsers(q, { signal: controller.signal });
            if (controller.signal.aborted || cancelRef.current !== controller) return;
            setSearchResult(items);
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

    const handleSubmit = () => doSearch(searchWord);

    const handleClear = () => {
    setSearchWord("");
    setSearchResult([]);
    setStatus("idle");
    setError(null);
    localStorage.removeItem(KEY);
    };

    return (
        <div>
            <SearchForm
            value={searchWord}
            loading={status === "loading"}
            onChange={setSearchWord}
            onSubmit={handleSubmit}
            onClear={handleClear}
            />
            {status === "idle" && <p className="badge">ユーザー名を入力して検索してください。</p>}
            {status === "loading" && <p className="badge">Searching…</p>}
            {status === "error" && (
                <div className="card">
                    <div style={{ marginBottom: 8 }}>⚠ {error}</div>
                    <button className="button" onClick={handleSubmit}>再試行</button>
                </div>
            )}
            {status === "success" && searchResult.length === 0 && (
                <p className="badge">一致するユーザーが見つかりませんでした。</p>
            )}

            {searchResult.length > 0 && (
                <div>
                    <div className="section-title">Results</div>
                    <div className="grid">
                        {searchResult.map((u) => (
                            <UserCard key={u.id} user={u} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}