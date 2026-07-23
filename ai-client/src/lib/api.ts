import { Configuration, PromptsApi, AuthApi, CategoriesApi, ChatroomsApi } from "../api-client";

const config = new Configuration({
    basePath: "http://localhost:3000",
    credentials: "include",
});

export const promptsApi = new PromptsApi(config);
export const authApi = new AuthApi(config);
export const categoriesApi = new CategoriesApi(config);
export const chatroomsApi = new ChatroomsApi(config);