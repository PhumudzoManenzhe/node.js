const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const Customers = require("./models/customer");
const customer = require("./models/customer");
mongoose.set("strictQuery", false);
const app = express();
app.use(express.json());
const PORT = process.env.PORT;
const CONNECTION = process.env.CONNECTION;

const Customer = new Customers({
  name: "phumudzo",
  industry: "marketing",
});

app.get("/api/customers", async (req, res) => {
  try {
    const result = await Customers.find();
    res.send({ customers: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customers.deleteOne({ _id: customerId });
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/customers", async (req, res) => {
  console.log(req.body);
  const Customer = new Customers(req.body);
  try {
    await Customer.save();
    res.status(201).json({ customer });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/customers/:id", async (req, res) => {
  console.log({
    requestParams: req.params,
    requestQuery: req.query,
  });
  try {
    const { id: customerId } = req.params;
    console.log(customerId);
    const customer = await Customers.findById(customerId);
    console.log(customer);
    if (!customer) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json({ customer });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const results = await Customers.replaceOne({ _id: customerId }, req.body);
    console.log(results);
    res.json({ updatedCount: results.modifiedCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);
    console.log("MongoDB Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("Database connection failed:");
    console.error(e.message);
    process.exit(1);
  }
};

start();
