import { getAccessToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = getAccessToken();
    const headers = {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMsg = "API request failed";
        try {
            const errorData = await response.json();
            errorMsg = errorData.detail || errorMsg;
        } catch (e) {
            // ignore
        }
        throw new Error(errorMsg);
    }

    return response.json();
}

export async function signup(email: string, password: string) {
    return fetchWithAuth("/v1/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
}

export async function login(email: string, password: string) {
    return fetchWithAuth("/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
}

export async function createProject(name: string) {
    return fetchWithAuth(`/v1/projects?name=${encodeURIComponent(name)}`, {
        method: "POST",
    });
}

export async function updateSlackWebhook(webhookUrl: string) {
    return fetchWithAuth("/v1/projects/webhook", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ webhook_url: webhookUrl }),
    });
}

export type BackendIncident = {
    started_at: string;
    event_name: string;
    resolved_at: string | null;
    duration: number | null;
};

export async function fetchActiveIncidents(environment?: string) {
    const url = environment ? `/v1/incidents/active?environment=${encodeURIComponent(environment)}` : `/v1/incidents/active`;
    return fetchWithAuth(url, {
        method: "GET",
    });
}

export async function fetchAllIncidents(environment?: string) {
    const url = environment ? `/v1/incidents?environment=${encodeURIComponent(environment)}` : `/v1/incidents`;
    return fetchWithAuth(url, {
        method: "GET",
    });
}

export async function sendTestEvent(eventName: string) {
    return fetchWithAuth("/v1/events/test", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_name: eventName }),
    });
}

export async function fetchStats(environment?: string) {
    const url = environment ? `/v1/stats?environment=${encodeURIComponent(environment)}` : `/v1/stats`;
    return fetchWithAuth(url, {
        method: "GET",
    });
}
