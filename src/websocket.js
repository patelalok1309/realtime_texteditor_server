import { Server } from "socket.io";
import { WEBSOCKET_EVENTS } from "./constants.js";
import { Document } from "./models/document.model.js";
let io;

export const initializeWebsocket = (server) => {
    // websocket initialization
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A client connected", socket.id);

        handleJoinDocument(socket);
        handleEditDocument(socket);
        handleDisconnet(socket);

        return io;
    });
};

const handleJoinDocument = (socket) => {
    // Join Document
    socket.on(WEBSOCKET_EVENTS.JOIN_DOCUMENT, async ({ documentId }) => {
        socket.join(documentId);

        // Load the document at the client side
        const document = await Document.findById(documentId);

        socket.emit("load-document", document.content || "");
    });
};

let documentBuffer = {};

const handleEditDocument = (socket) => {
    // EDIT DOCUMENT
    socket.on(WEBSOCKET_EVENTS.EDIT_DOCUMENT, ({ documentId, content }) => {
        if (!documentBuffer[documentId]) {
            documentBuffer[documentId] = [];
        }
        documentBuffer[documentId].push(content);

        // Broadcast changes to other clients in the room
        socket.to(documentId).emit(WEBSOCKET_EVENTS.DOCUMENT_UPDATE, content);
    });
};

const handleDisconnet = (socket) => {
    // DISCONNECT
    socket.on(WEBSOCKET_EVENTS.DISCONNECT, () => {
        console.log("A client disconnected", socket.id);
        // Remove the user from all rooms
        const rooms = Array.from(socket.rooms);
        rooms.forEach((room) => {
            socket.leave(room);
        });
    });
};

//  Flush the buffers to database
setInterval(async () => {
    for (const documentId in documentBuffer) {
        const updates = documentBuffer[documentId];
        if (updates.length > 0) {
            const mergedContent = updates[updates.length - 1];
            await Document.findByIdAndUpdate(documentId, {
                content: mergedContent,
            });
            documentBuffer[documentId] = [];
            console.log(`flushed content of ${documentId} to database`);
        }
    }
}, 5000);

export default io;
