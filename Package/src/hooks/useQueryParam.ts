export function getQueryParam(name: string) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}


export function setQueryParam(name: string, value: string | null, replace = false) {
    const url = new URL(window.location.href);
    if (value && value.length > 0) {
        url.searchParams.set(name, value);
    } else {
        url.searchParams.delete(name);
    }
    if (replace) {
        window.history.replaceState({}, "", url.toString());
    } else {
        window.history.pushState({}, "", url.toString());
    }
}