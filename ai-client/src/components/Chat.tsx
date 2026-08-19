import {useEffect, useState} from "react";
import {chatroomsApi} from "@/lib/api";
import {ResponseError} from "@/api-client";
import type {UserChatMessage} from "@/api-client";
import {useChatSocket} from "@/hooks/useChatSocket";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Bubble, BubbleContent} from "@/components/ui/bubble";
import {Message, MessageAvatar, MessageContent, MessageHeader} from "@/components/ui/message";
import {
    MessageScroller,
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerProvider,
    MessageScrollerViewport,
} from "@/components/ui/message-scroller";

interface ChatProps {
    promptId: number;
    promptTitle: string;
}

type SetupState =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; chatId: number; initialMessages: UserChatMessage[]; username: string };

export function Chat({promptId, promptTitle}: ChatProps) {
    const [setup, setSetup] = useState<SetupState>({status: "loading"});

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (!username) {
            setSetup({status: "error", message: "You have to be logged in!"});
            return;
        }

        (async () => {
            try {
                const {chat_id} = await chatroomsApi.joinOrCreateChatroom({promptId});
                const messages = await chatroomsApi.getChatMessages({id: chat_id});
                setSetup({status: "ready", chatId: chat_id, initialMessages: messages, username});
            } catch (err) {
                let message = "Chat could not be loaded.";
                if (err instanceof ResponseError) {
                    const body = await err.response.json().catch(() => null);
                    message = body?.message ?? message;
                }
                console.error(err);
                setSetup({status: "error", message});
            }
        })();
    }, [promptId]);

    if (setup.status === "loading") {
        return <p className="text-muted-foreground">Chat is loading...</p>;
    }

    if (setup.status === "error") {
        return <p className="text-destructive">{setup.message}</p>;
    }

    return (
        <ChatWindow
            chatId={setup.chatId}
            username={setup.username}
            initialMessages={setup.initialMessages}
            promptTitle={promptTitle}
        />
    );
}

interface ChatWindowProps {
    chatId: number;
    username: string;
    initialMessages: UserChatMessage[];
    promptTitle: string;
}

function ChatWindow({chatId, username, initialMessages, promptTitle}: ChatWindowProps) {
    const {status, messages, typingUsers, lastError, sendMessage, startTyping, stopTyping} = useChatSocket(
        chatId,
        username,
        initialMessages
    );
    const [draft, setDraft] = useState("");

    const handleSend = () => {
        if (!draft.trim()) return;
        sendMessage(draft);
        setDraft("");
        stopTyping();
    };

    return (
        <div className="flex h-[80vh] w-full max-w-2xl flex-col">
            <h2 className="border-b p-3 text-lg font-semibold">{promptTitle}</h2>

            {lastError && (
                <p className="bg-destructive/10 px-4 py-2 text-sm text-destructive">{lastError}</p>
            )}

            <MessageScrollerProvider autoScroll>
                <MessageScroller className="flex-1">
                    <MessageScrollerViewport>
                        <MessageScrollerContent>
                            {messages.map((m, i) => {
                                const isOwn = m.username === username;
                                return (
                                    <MessageScrollerItem key={i} messageId={String(i)} scrollAnchor={isOwn}>
                                        <Message align={isOwn ? "end" : "start"}>
                                            <MessageAvatar>
                                                <Avatar>
                                                    <AvatarFallback>{m.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </MessageAvatar>
                                            <MessageContent>
                                                <MessageHeader>{m.username}</MessageHeader>
                                                <Bubble>
                                                    <BubbleContent>{m.message}</BubbleContent>
                                                </Bubble>
                                            </MessageContent>
                                        </Message>
                                    </MessageScrollerItem>
                                );
                            })}
                        </MessageScrollerContent>
                    </MessageScrollerViewport>
                    <MessageScrollerButton/>
                </MessageScroller>
            </MessageScrollerProvider>

            {typingUsers.size > 0 && (
                <p className="px-4 text-sm text-muted-foreground">
                    {[...typingUsers].join(", ")} is typing...
                </p>
            )}

            <div className="flex gap-2 p-4">
                <input
                    className="flex-1 rounded-md border px-3 py-2"
                    value={draft}
                    disabled={status !== "open"}
                    onChange={(e) => {
                        setDraft(e.target.value);
                        startTyping();
                    }}
                    onBlur={stopTyping}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={status === "open" ? "Write message..." : "Connecting..."}
                />
                <button
                    onClick={handleSend}
                    disabled={status !== "open"}
                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
                >
                    Send
                </button>
            </div>
        </div>
    );
}