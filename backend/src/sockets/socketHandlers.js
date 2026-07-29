const socketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ Client Connected: ${socket.id}`);

    // When client connects, emit current data
    socket.emit("init", { message: "Connected to live updates" });

    // Send periodic updates to simulate fresh data arrivals
    // In production, this would be triggered by actual data changes
    const updateInterval = setInterval(async () => {
      try {
        // Get fresh data from controllers
        const Client = require("../models/Client");
        const Trade = require("../models/Trade");
        const Employee = require("../models/Employee");
        const Mapping = require("../models/Mapping");

        // Fetch latest data
        const clients = await Client.find();
        const trades = await Trade.find();
        const employees = await Employee.find();
        const mappings = await Mapping.find()
          .populate("employee")
          .populate("client");

        // Broadcast to all connected clients
        io.emit("clients:updated", { data: clients, count: clients.length });
        io.emit("trades:updated", { data: trades, count: trades.length });
        io.emit("employees:updated", { data: employees, count: employees.length });
        io.emit("mappings:updated", { data: mappings, count: mappings.length });
      } catch (error) {
        console.error("Socket update error:", error);
      }
    }, 30000); // Update every 30 seconds

    socket.on("disconnect", () => {
      clearInterval(updateInterval);
      console.log(`❌ Client Disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandlers;
