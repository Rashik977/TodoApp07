import express from "express";
import config from "./config";
import router from "./routes";
import { errorHandler } from "./middlewares/ErrorHandling";
import { requestLogger } from "./middlewares/logger";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

const app = express();
const port = config.port;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  message: "Too many requests",
});

// Add security headers
app.use(helmet());

// Limit requests
app.use(limiter);

// Allow only specific origins
const allowedOrigins = ["https://example.com"];

// Enable CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed"));
      }
    },
  })
);

// Parse JSON
app.use(express.json());

// For logger
app.use(requestLogger);

// Add routes
app.use(router);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
