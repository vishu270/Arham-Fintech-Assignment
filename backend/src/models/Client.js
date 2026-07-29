const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    clientCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    pan: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);