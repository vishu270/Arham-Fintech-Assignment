require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const connectDB = require("../config/db");

const Client = require("../models/Client");
const Trade = require("../models/Trade");
const Employee = require("../models/Employee");
const Mapping = require("../models/Mapping");

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log("Clearing existing collections...");
    await Promise.all([
      Client.deleteMany({}),
      Trade.deleteMany({}),
      Employee.deleteMany({}),
      Mapping.deleteMany({}),
    ]);

    console.log("Generating employees...");
    const employeeDocs = [];
    for (let i = 1; i <= 20; i += 1) {
      employeeDocs.push({
        employeeCode: `EMP${String(i).padStart(3, "0")}`,
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
      });
    }
    const createdEmployees = await Employee.insertMany(employeeDocs);
    console.log(`Created ${createdEmployees.length} employees.`);

    console.log("Generating clients...");
    const clientDocs = [];
    for (let i = 1; i <= 250; i += 1) {
      clientDocs.push({
        clientCode: `CLT${String(i).padStart(4, "0")}`,
        name: faker.person.fullName(),
        pan: `PAN${String(i).padStart(6, "0")}`,
        mobile: faker.phone.number("+91##########"),
        email: faker.internet.email().toLowerCase(),
      });
    }
    const createdClients = await Client.insertMany(clientDocs);
    console.log(`Created ${createdClients.length} clients.`);

    console.log("Creating employee-client mappings...");
    const mappings = createdClients.map((client, index) => ({
      employee: createdEmployees[index % createdEmployees.length]._id,
      client: client._id,
    }));
    await Mapping.insertMany(mappings);
    console.log(`Created ${mappings.length} mappings.`);

    console.log("Generating trades...");
    const tradeDocs = [];
    const symbols = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA", "INFY", "RELIANCE", "HDFCBANK", "ICICIBANK"];

    createdClients.forEach((client, clientIndex) => {
      const tradeCount = 10 + (clientIndex % 6);

      for (let j = 0; j < tradeCount; j += 1) {
        tradeDocs.push({
          client: client._id,
          symbol: symbols[(clientIndex + j) % symbols.length],
          quantity: faker.number.int({ min: 10, max: 500 }),
          price: Number(faker.commerce.price({ min: 100, max: 2500, dec: 2 })),
          tradeDate: faker.date.past({ years: 2 }),
        });
      }
    });

    await Trade.insertMany(tradeDocs);
    console.log(`Created ${tradeDocs.length} trades.`);

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

seedDatabase();