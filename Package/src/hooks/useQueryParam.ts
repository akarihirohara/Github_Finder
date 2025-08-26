// =============================================
// 役割: URLクエリの読み書き（useState版では未使用。学習/将来用）
// =============================================
export function getQueryParam(name: string) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);          // 値がなければ null
}


export function setQueryParam(name: string, value: string | null, replace = false) {
    const url = new URL(window.location.href);
    if (value && value.length > 0) {
        url.searchParams.set(name, value);                      // 追加/更新
    } else {
        url.searchParams.delete(name);                          // 削除
    }
    // pushState: 履歴を積む / replaceState: 現在の履歴を書き換える
    if (replace) {
        window.history.replaceState({}, "", url.toString());
    } else {
        window.history.pushState({}, "", url.toString());
    }
}