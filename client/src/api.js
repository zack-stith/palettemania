export async function apiRequest(path, options = {}) {
    const res = await fetch("/api" + path, {
        method: options.method ?? "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options.body),
    });

    if (res.status === 204) {
        return null;
    }

    let parsed;
    try {
        parsed = await res.json();
    } catch {
        parsed = {};
    }

    if (!res.ok) {
        const err = new Error(parsed.error ?? "Something went wrong");
        err.status = res.status;
        throw err;
    }

    return parsed;
}

export function getPalettes(page = 1, sort = "newest") {
    return apiRequest(`/palettes?page=${page}&sort=${sort}`);
}

export function login(identifier, password) {
    return apiRequest("/auth/login", {
        method: "POST",
        body: { identifier, password },
    });
}