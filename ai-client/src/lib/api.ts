import { Configuration, AuthApi, PromptsApi, CategoriesApi, ChatroomsApi, FetchError } from "@/api-client";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
    if (isRefreshing && refreshPromise) {
        return refreshPromise; // falls schon ein Refresh läuft, daran anhängen statt doppelt zu feuern
    }

    isRefreshing = true;
    refreshPromise = fetch(`${basePath}/refresh`, {
        method: "POST",
        credentials: "include",
    }).then((res) => {
        isRefreshing = false;
        if (!res.ok) {
            throw new Error("Refresh fehlgeschlagen");
        }
    });

    return refreshPromise;
}

const basePath = import.meta.env.PUBLIC_API_BASE_URL ?? "http://localhost:3000";

const config = new Configuration({
    basePath,
    credentials: "include",
    middleware: [
        {
            post: async (context) => {
                if (context.response.status === 401) {
                    try {
                        await refreshAccessToken();
                        // Request mit demselben Init erneut stellen
                        return fetch(context.url, context.init);
                    } catch {
                        // Refresh fehlgeschlagen (Token wirklich abgelaufen) -> zum Login schicken
                        window.location.href = "/auth";
                        throw new Error("Session abgelaufen");
                    }
                }
                return context.response;
            },
        },
    ],
});

export const authApi = new AuthApi(config);
export const promptsApi = new PromptsApi(config);
export const categoriesApi = new CategoriesApi(config);
export const chatroomsApi = new ChatroomsApi(config);
export { ResponseError } from "@/api-client";