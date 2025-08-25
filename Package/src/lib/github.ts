import axios from "axios";
import type { UserSummary } from "../components/UserCard";
import type { Repo } from "../components/RepoCard";

const gh = axios.create({
    baseURL: "https://api.github.com",
    headers: import.meta.env.VITE_GH_TOKEN
    ? { Authorization: `token ${import.meta.env.VITE_GH_TOKEN}` }
    : undefined,
});

type Opt = { signal?: AbortSignal };

export async function searchUsers(q: string, opt: Opt = {}): Promise<UserSummary[]> {
    const { data } = await gh.get("/search/users", {
        params: { q, per_page: 30 },
        signal: opt.signal,
    });
    const items = (data?.items ?? []) as any[];
    return items.map((u) => ({
        id: u.id,
        login: u.login,
        avatar_url: u.avatar_url,
        html_url: u.html_url,
    }));
}

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

export async function getRepos(login: string, opt: Opt = {}): Promise<Repo[]> {
    const { data } = await gh.get(`/users/${login}/repos`, {
        params: { sort: "updated", per_page: 30 },
        signal: opt.signal,
    });
    return data as Repo[];
}