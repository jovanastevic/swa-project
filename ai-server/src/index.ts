import {loadEnvFile} from "node:process";
loadEnvFile();

import express from "express";  //<- Makes writing APIs easier
import cors from "cors"; // <- Allows requests from other origins (frontend)
import {createServer} from "node:http";  // <- Creates a HTTP server
import {WebSocketServer} from "ws"; // <- WebSocket server for real-time communication

// Import controllers
import {AuthController} from "./controller/AuthController";

// Servers initialization
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({server});

app.use(express.json());
//app.use(cookieParser());
app.use(express.static("public")); //nur für den test WS
app.use(cors({
    origin: 'http://localhost:4321',
    credentials: true
}));

// Initialize controllers
AuthController.init(app);


server.listen(3000, () => {
    console.log("Server is running on port 3000");
});