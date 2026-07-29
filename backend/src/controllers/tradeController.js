const Trade = require("../models/Trade");

// Fetch trades with optional filtering by client and date range.
const getTrades = async (req, res) => {
  try {
    const { client, clientId, startDate, endDate } = req.query;
    const selectedClient = client || clientId;

    const filter = {};

    if (selectedClient) {
      filter.client = selectedClient;
    }

    if (startDate || endDate) {
      filter.tradeDate = {};

      if (startDate) {
        const start = new Date(startDate);
        if (Number.isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid startDate",
          });
        }
        filter.tradeDate.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        if (Number.isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid endDate",
          });
        }
        filter.tradeDate.$lte = end;
      }
    }

    const trades = await Trade.find(filter)
      .populate("client", "clientCode name")
      .sort({ tradeDate: -1 });

    res.status(200).json({
      success: true,
      count: trades.length,
      data: trades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch trades",
      error: error.message,
    });
  }
};

module.exports = {
  getTrades,
};
