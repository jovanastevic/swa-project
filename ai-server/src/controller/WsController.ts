import { WebSocketServer, WebSocket } from 'ws';
import { WsService } from '../service/WsService';
import { IWSChatMessage, WSEventSchema } from "../interface/Ws";
import z from "zod";

export class WsController {
    // Sicher im Controller gekapselt
    private static chatRooms = new Map<WebSocket, number>();

    private static broadcastToChat(wss: WebSocketServer, data: IWSChatMessage) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && this.chatRooms.get(client) === data.chat_id) {
                client.send(JSON.stringify({
                    event: 'message',
                    // Konsistent auf 'username' geändert, damit das Frontend nicht verwirrt wird
                    data: { username: data.username, message: data.message, time_stamp: data.time_stamp }
                }));
            }
        });
    }

    private static broadcastTypingToChat(wss: WebSocketServer, chat_id: number, username: string, typing: 'startTyping' | 'stopTyping') {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && this.chatRooms.get(client) === chat_id) {
                // Konsistent auf 'username' geändert
                client.send(JSON.stringify({ event: typing, data: { username: username } }));
            }
        });
    }

    static async init(wss: WebSocketServer) {
        wss.on('connection', (ws) => {
            ws.on('error', console.error);

            ws.on('message', async (message) => {
                try {
                    // 1. JSON sicher parsen (.toString() ist wichtig, da 'message' oft ein Buffer ist)
                    const rawData = JSON.parse(message.toString());

                    // 2. Mit Zod exakt validieren, ob das Event korrekt strukturiert ist
                    const parsed = WSEventSchema.safeParse(rawData);

                    if (!parsed.success) {
                        ws.send(JSON.stringify({
                            event: 'error',
                            data: { message: "Invalid payload format", errors: z.treeifyError(parsed.error) }
                        }));
                        return;
                    }

                    const data = parsed.data;

                    switch (data.event) {
                        case 'join': {
                            const isAllowed = await WsService.isUserInRoom(data.username, data.chat_id);
                            if (!isAllowed) {
                                ws.send(JSON.stringify({ event: 'error', data: { message: "You are not allowed" } }));
                                return;
                            }
                            this.chatRooms.set(ws, data.chat_id);
                            break;
                        }
                        case 'startTyping':
                        case 'stopTyping': {
                            if (this.chatRooms.get(ws) === data.chat_id) {
                                this.broadcastTypingToChat(wss, data.chat_id, data.username, data.event);
                            }
                            break;
                        }
                        case 'message': {
                            if (this.chatRooms.get(ws) !== data.chat_id) return;

                            if (data.message) {
                                const isSaved = await WsService.newMessage({
                                    chat_id: data.chat_id,
                                    username: data.username,
                                    message: data.message
                                });

                                if (isSaved) {
                                    this.broadcastToChat(wss, {
                                        chat_id: data.chat_id,
                                        username: data.username,
                                        message: data.message,
                                        time_stamp: new Date()
                                    });
                                } else {
                                    ws.send(JSON.stringify({ event: 'error', data: { message: "Failed to save message" } }));
                                }
                            }
                            break;
                        }
                    }
                } catch (error) {
                    // Fängt ab, falls der Client "Hallo Welt" statt {"event": "join"} schickt
                    console.error("WebSocket payload error:", error);
                    ws.send(JSON.stringify({ event: 'error', data: { message: "Malformed JSON" } }));
                }
            });

            ws.on('close', () => this.chatRooms.delete(ws));
        });
    }
}