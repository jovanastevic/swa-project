import {loadEnvFile} from "node:process";
loadEnvFile();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {createServer} from "node:http";
import {WebSocketServer} from "ws";


const app = express();
const server = createServer(app);
const wss = new WebSocketServer({server});

app.use(bodyParser.json());
//app.use(cookieParser());
app.use(express.static("public")); //nur für den test WS
app.use(cors({
    origin: 'http://localhost:4321',
    credentials: true
}));


server.listen(3000, () => {
    console.log("Server is running on port 3000");
});