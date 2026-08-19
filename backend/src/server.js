const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const pool = require("./config/database");
const initializeDatabase = require("./config/initDatabase");

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const {
  authRateLimiter,
  apiRateLimiter,
} = require("./middleware/rateLimitMiddleware");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", apiRateLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MAGERWA Vehicle Management API is running",
  });
});

app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("PostgreSQL connection verified");

    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();