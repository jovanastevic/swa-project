import { useEffect, useRef, useState, useCallback } from "react";
import type {UserChatMessage} from "@/api-client";

type ServerEvent =
    | { event: "message"; data: UserChatMessage }
    | { event: "startTyping"; data: { username: string } }
    | { event: "stopTyping"; data: { username: string } }
    | { event: "error"; data: { message: string; errors?: unknown } };

type ConnectionStatus = "connecting" | "open" | "closed" | "error";

export function useChatSocket(chatId: number, username: string, initialMessages: UserChatMessage[] = []) {
    const wsRef = useRef<WebSocket | null>(null);
    const [status, setStatus] = useState<ConnectionStatus>("connecting");
    const [messages, setMessages] = useState<UserChatMessage[]>(initialMessages);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [lastError, setLastError] = useState<string | null>(null);

    useEffect(() => {
        const ws = new WebSocket(import.meta.env.PUBLIC_WS_URL ?? "ws://localhost:3000");
        wsRef.current = ws;
        setStatus("connecting");

        ws.onopen = () => {
            setStatus("open");
            ws.send(JSON.stringify({ event: "join", chat_id: chatId, username }));
        };

        ws.onmessage = (raw) => {
            const payload: ServerEvent = JSON.parse(raw.data);
            switch (payload.event) {
                case "message":
                    setMessages((prev) => [...prev, payload.data]);
                    break;
                case "startTyping":
                    setTypingUsers((prev) => new Set(prev).add(payload.data.username));
                    break;
                case "stopTyping":
                    setTypingUsers((prev) => {
                        const next = new Set(prev);
                        next.delete(payload.data.username);
                        return next;
                    });
                    break;
                case "error":
                    console.error("WS error:", payload.data.message, payload.data.errors);
                    setLastError(payload.data.message);
                    break;
            }
        };

        ws.onerror = () => setStatus("error");
        ws.onclose = () => setStatus("closed");

        return () => ws.close();
    }, [chatId, username]);

    const sendMessage = useCallback(
        (message: string) => {
            if (wsRef.current?.readyState !== WebSocket.OPEN) return;
            wsRef.current.send(JSON.stringify({ event: "message", chat_id: chatId, username, message }));
        },
        [chatId, username]
    );

    const startTyping = useCallback(() => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;
        wsRef.current.send(JSON.stringify({ event: "startTyping", chat_id: chatId, username }));
    }, [chatId, username]);

    const stopTyping = useCallback(() => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;
        wsRef.current.send(JSON.stringify({ event: "stopTyping", chat_id: chatId, username }));
    }, [chatId, username]);

    return { status, messages, typingUsers, lastError, sendMessage, startTyping, stopTyping };
}