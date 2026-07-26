import { useState } from "react";
import { ResponseError } from "@/api-client";
import { authApi } from "@/lib/api.ts";
import type { User, UserLogin } from "@/api-client";

interface FormData {
    username: string;
    password: string;
    email: string;
    profile_description: string;
}

const initialFormData: FormData = {
    username: "",
    password: "",
    email: "",
    profile_description: "",
};

// TODO: code checken

async function extractErrorMessage(err: unknown): Promise<string> {
    if (err instanceof ResponseError) {
        try {
            const body = await err.response.json();
            const fieldErrors = body?.errors?.properties;
            if (fieldErrors) {
                const firstField = Object.keys(fieldErrors)[0];
                const firstMsg = fieldErrors[firstField]?.errors?.[0];
                if (firstMsg) return `${firstField}: ${firstMsg}`;
            }
            if (body?.message) return body.message;
        } catch {
            // Body war kein JSON
        }
    }
    return "Etwas ist schiefgelaufen. Bitte versuch's erneut.";
}

export function useAuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const toggleMode = () => {
        setIsLogin((prev) => !prev);
        setError("");
    };

    const login = async () => {
        const payload: UserLogin = {
            username: formData.username,
            password: formData.password,
        };
        await authApi.loginUser({ userLogin: payload });
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/";
    };

    const register = async () => {
        const payload: User = {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            profile_description: formData.profile_description || null,
        };
        await authApi.registerUser({ user: payload });
        setIsLogin(true);
        setFormData(initialFormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await (isLogin ? login() : register());
        } catch (err) {
            setError(await extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return { isLogin, formData, error, loading, handleChange, toggleMode, handleSubmit };
}