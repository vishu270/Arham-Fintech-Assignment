const delayMs = Number(process.env.BSE_DELAY || 0);
const failureRate = Number(process.env.BSE_FAILURE_RATE || 0);

// Reusable middleware for the BSE endpoints only.
// It adds an optional artificial delay and simulates occasional failures.
const bseMiddleware = async (req, res, next) => {
  try {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    if (failureRate > 0 && Math.random() < failureRate) {
      console.warn(
        `[BSE fallback] Simulated BSE failure for ${req.method} ${req.originalUrl}. Returning MongoDB fallback data.`
      );
      return next();
    }

    return next();
  } catch (error) {
    console.error("BSE middleware failed:", error);
    return res.status(500).json({
      success: false,
      message: "BSE middleware failed",
      error: error.message,
    });
  }
};

module.exports = bseMiddleware;
