const Employee = require("../models/Employee");
const Mapping = require("../models/Mapping");

// Fetch all employees.
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

// Fetch all employee-client mappings with populated references.
const getMappings = async (req, res) => {
  try {
    const mappings = await Mapping.find({})
      .populate("employee", "employeeCode name email")
      .populate("client", "clientCode name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: mappings.length,
      data: mappings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch mappings",
      error: error.message,
    });
  }
};

module.exports = {
  getEmployees,
  getMappings,
};
