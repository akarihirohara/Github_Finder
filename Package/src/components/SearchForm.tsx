// =============================================
// 役割: 検索欄 + Search/Clear ボタン。入力は制御コンポーネント
// =============================================
import type { FormEvent } from "react"; // TS 5 + verbatimModuleSyntax 対応: 型の import は type 指定


type Props = {
    value: string; // 入力欄の現在値
    loading?: boolean; // ローディング中は無効化
    onChange: (v: string) => void; // 入力更新コールバック
    onSubmit: () => void; // 検索実行
    onClear: () => void; // クリア実行
};


export default function SearchForm({ value, loading, onChange, onSubmit, onClear }: Props) {
    // Enter キーでの送信に対応
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit();
    };


    return (
        <form onSubmit={handleSubmit} className="row" style={{ gap: 8, marginBottom: 16 }}>
            <input
            className="input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search GitHub users"
            aria-label="Search GitHub users"
            disabled={loading}
            />
            <button type="submit" className="button primary" disabled={loading || !value.trim()}>
                {loading ? "Searching…" : "Search"}
            </button>
            <button type="button" className="button" onClick={onClear} disabled={loading && !value}>
                Clear
            </button>
        </form>
    );
}