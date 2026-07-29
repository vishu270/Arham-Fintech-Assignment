const Client = require("../models/Client");

// Fetch all clients from the database.
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};

module.exports = {
  getClients,
};
