import {
    Card,
    CardDescription, CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {useEffect, useState} from 'react';
import {chatroomsApi} from '../lib/api.ts';
import type {ChatroomOverview} from "@/api-client";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MessageCircleIcon} from "lucide-react";
import {formatTimestamp} from "@/lib/utils.ts";

export function ChatOverview() {
    const [chatrooms, setChatrooms] = useState<ChatroomOverview[] | null>(null);

    useEffect(() => {
        chatroomsApi.getChatOverview()
            .then(data => setChatrooms(data))
            .catch(err => console.log(err));
    }, []);

    // console.log(chatrooms);
    if (!chatrooms) {
        return (
            <main className="flex flex-col items-center min-h-screen p-4 space-y-2">
                <p>Loading chats...</p>
            </main>
        );
    }

    if(chatrooms.length === 0) {
        return (
            <main className="flex flex-col items-center min-h-screen p-4 space-y-2">
                <p>You don't have any active chats.</p>
            </main>
        )
    }

    // @ts-ignore
    const chatList = chatrooms.map(chat =>
        <Card key={chat.chat_id} className="mx-auto w-full max-w-1/2">
            <CardHeader>
                <div>
                    <Badge>{chat.category_title}</Badge>
                </div>
                <CardTitle><a href={`/prompt/${chat.prompt_id}`}>{chat.prompt_title}</a></CardTitle>
                <CardDescription>
                    <span className="font-bold">{formatTimestamp(chat.chatroom_time_stamp)}</span>
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button asChild className="w-full">
                    <a href={`/prompt/chat/${chat.prompt_id}`}>
                        <MessageCircleIcon/>
                        Open Chat
                    </a>
                </Button>
            </CardFooter>
        </Card>
    )

    return (
        <main className="flex flex-col items-center min-h-screen p-4 space-y-2">
            <h2 className="text-2xl font-semibold">Chat-Overview</h2>
            {chatList}
        </main>
    );
}