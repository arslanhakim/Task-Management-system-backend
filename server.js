import express from "express";
import http from "http";
// import { Server } from "socket.io/dist/index.js";
import { Server } from "socket.io";

import jsonServer from "json-server";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url"; // Import the fileURLToPath function

const __filename = fileURLToPath(import.meta.url); // Convert the import.meta.url to __filename
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
// Apply CORS middleware for Socket.IO
// const io = new Server({
//   cors: {
//     origin: "http://localhost:5174", // Replace with your frontend URL
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const jsonRouter = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// const port = process.env.PORT || 3001;
const port = 3000;
// WebSocket server configuration
const wsPort = 3001; // WebSocket server port

// app.use(cors({ origin: "http://localhost:5173" })); // Use cors middleware for the Express app

app.use(express.static(path.join(__dirname, "public")));
app.use(middlewares);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("notification", (data) => {
    console.log("Received notification:", data);
    io.emit("newNotification", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(wsPort, () => {
  console.log(`WebSocket server is running on port ${wsPort}`);
});

// Use the json-server router for API routes
app.use("/api", jsonRouter);

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});

// API route to get tasks by groupId
app.get("/tasks", (req, res) => {
  const { groupId } = req.query;
  const filteredTasks = tasks.filter((task) => task.groupId === groupId);
  res.json(filteredTasks);
});

// API route to add a new task
app.post("/tasks", (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);
  res.json(newTask);
});
