function setCookie(name: string, value: string) {
    if (typeof window !== "undefined") {
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=86400; SameSite=Lax; Secure`;
    }
}

function getCookie(name: string): string | null {
    if (typeof window !== "undefined") {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return decodeURIComponent(match[2]);
    }
    return null;
}

export function setAccessToken(token: string) {
    setCookie("access_token", token);
}

export function getAccessToken(): string | null {
    return getCookie("access_token");
}

export function setProjectId(projectId: string) {
    setCookie("project_id", projectId);
}

export function getProjectId(): string | null {
    return getCookie("project_id");
}

export function setApiKey(apiKey: string) {
    setCookie("api_key", apiKey);
}

export function getApiKey(): string | null {
    return getCookie("api_key");
}

export function setUserEmail(email: string) {
    setCookie("user_email", email);
}

export function getUserEmail(): string | null {
    return getCookie("user_email");
}

export function logout() {
    if (typeof window !== "undefined") {
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "project_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "api_key=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/login";
    }
}
