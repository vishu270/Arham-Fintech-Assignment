const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const http = require("http");
const socketIO = require("socket.io");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const socketHandlers = require("./src/sockets/socketHandlers");

const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// HTTP Server
const server = http.createServer(app);

// Socket.IO Setup
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.IO Event Handlers
socketHandlers(io);

server.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
  console.log(`📡 Socket.IO Listening on ws://localhost:${PORT}`);
});