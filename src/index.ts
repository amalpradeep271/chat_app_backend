import { json } from "body-parser";
import authRoutes from "./routes/authRoutes";
import conversationsRoutes from "./routes/conversationsRoutes";
import contactRoutes from "./routes/contactRoutes";
import messagesRoutes from "./routes/messagesRoutes";
import http from "http";
import { Server } from "socket.io";
import express, { Request, Response } from "express";
import { saveMessage } from "./controllers/messageControllers";
import { error } from "console";
import "./cron/cronJob";

const app = express();
const server = http.createServer(app);
app.use(json());
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use("/auth", authRoutes);
app.use("/conversations", conversationsRoutes);
app.use("/messages", messagesRoutes);
app.use("/contacts", contactRoutes);
// app.use("/messages", messagesRoutes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log("User joined conversation :" + conversationId);
  });

  socket.on("sendMessage", async (message) => {
    const { conversationId, senderId, content } = message;

    try {
      const savedMessage = await saveMessage(conversationId, senderId, content);
      console.log("sendMessage : ");
      console.log(savedMessage);
      io.to(conversationId).emit("newMessage", savedMessage);

      io.emit("conversationUpdated", {
        conversationId,
        lastMessage: savedMessage.content,
        lastMessageTime: savedMessage.created_at,
      });
    } catch (err) {
      console.error("Failed to save message", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
