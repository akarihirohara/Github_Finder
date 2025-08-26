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


    // 初回：保存された検索語があれば自動検索
    useEffect(() => {
        if (!searchWord.trim()) return; // 空なら何もしない
        doSearch(searchWord);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 実際の検索処理（共通化）
    const doSearch = async (q: string) => {
        if (!q.trim()) return;          // 空文字は検索しない
        setStatus("loading");
        setError(null);
        localStorage.setItem(KEY, q);   // 直近語を保存


        // 多重リクエスト対策：前回分をキャンセル
        cancelRef.current?.abort();
        const controller = new AbortController();
        cancelRef.current = controller;


        try {
            const items = await searchUsers(q, { signal: controller.signal });          // API 呼び出し
            // 受信時に最新検索かどうかチェック
            if (controller.signal.aborted || cancelRef.current !== controller) return;
            setSearchResult(items); // 結果を反映
            setStatus("success");
        } catch (e: any) {
            // キャンセル時は無視
            if (e?.name === "CanceledError" || e?.name === "AbortError") return;
            // ステータスコードで文言を出し分け
            const code = e?.response?.status;
            if (code === 403 || code === 429) setError("レート制限中です。時間をおいて再試行するか、PAT を設定してください。");
            else if (e?.request && !e?.response) setError("ネットワークエラーです。接続を確認してください。");
            else setError("検索に失敗しました。もう一度お試しください。");
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

            {/* 検索結果のグリッド */}
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