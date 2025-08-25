import type { FormEvent } from "react";


type Props = {
    value: string;
    loading?: boolean;
    onChange: (v: string) => void;
    onSubmit: () => void;
    onClear: () => void;
};


export default function SearchForm({ value, loading, onChange, onSubmit, onClear }: Props) {
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
            placeholder="GitHubユーザーを検索"
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