
// =============================================
// 役割: GitHub API 呼び出しのユーティリティ（axios インスタンス + 各関数）
// =============================================
import axios from "axios";
import type { UserSummary } from "../components/UserCard";
import type { Repo } from "../components/RepoCard";

// axios インスタンス。環境変数 VITE_GH_TOKEN があれば Authorization を付与
const gh = axios.create({
    baseURL: "https://api.github.com",
    headers: import.meta.env.VITE_GH_TOKEN
    ? { Authorization: `token ${import.meta.env.VITE_GH_TOKEN}` }
    : undefined,
});

type Opt = { signal?: AbortSignal; page?: number };

// ユーザー検索（/search/users）。Home で使うため、最低限のフィールドに整形して返す
// lib/github.ts
export async function searchUsers(
  q: string,
  opt: Opt = {}
): Promise<{ items: UserSummary[]; total: number }> {
  const { data } = await gh.get("/search/users", {
    params: { q, per_page: 30, page: opt.page ?? 1 },
    signal: opt.signal,
  });
  const items = (data?.items ?? []).map((u: any) => ({
    id: u.id, login: u.login, avatar_url: u.avatar_url, html_url: u.html_url
  }));
  const total = Number(data?.total_count ?? 0);
  return { items, total };
}


// ユーザー詳細（/users/:login）
export async function getUser(login: string, opt: Opt = {}) {
    const { data } = await gh.get(`/users/${login}`, { signal: opt.signal });
    return data as {
        avatar_url: string;
        name: string | null;
        login: string;
        company: string | null;
        blog: string | null;
        location: string | null;
        bio: string | null;
        followers: number;
        following: number;
        public_repos: number;
        html_url: string;
    };
}

// リポジトリ一覧（/users/:login/repos）
export async function getRepos(login: string, opt: Opt = {}): Promise<Repo[]> {
    const { data } = await gh.get(`/users/${login}/repos`, {
        params: { sort: "updated", per_page: 30 },  // 更新日降順
        signal: opt.signal,
    });
    return data as Repo[];
}