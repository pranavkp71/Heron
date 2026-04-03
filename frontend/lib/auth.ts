export function setAccessToken(token: string) {
    if (typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
    }
}

export function getAccessToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("access_token");
    }
    return null;
}

export function setProjectId(projectId: string) {
    if (typeof window !== "undefined") {
        localStorage.setItem("project_id", projectId);
    }
}

export function getProjectId(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("project_id");
    }
    return null;
}

export function setApiKey(apiKey: string) {
    if (typeof window !== "undefined") {
        localStorage.setItem("api_key", apiKey);
    }
}

export function getApiKey(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("api_key");
    }
    return null;
}

export function logout() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("project_id");
        localStorage.removeItem("api_key");
        localStorage.removeItem("user_email");
        window.location.href = "/login";
    }
}
