import { config } from "dotenv";
config();

import { createServer } from "node:http";

import dbConnect from "./src/dbConnect.js";
import { app } from "./src/app.js";
import { initializeWebsocket } from "./src/websocket.js";
const PORT = process.env.PORT;

const httpServer = createServer(app);

const io = initializeWebsocket(httpServer);

dbConnect()
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => console.log(error));
