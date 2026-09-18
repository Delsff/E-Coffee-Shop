import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRouter from "./routes/products";
import authRouter from "./routes/auth";
import ordersRouter from "./routes/orders";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Coffee Shop API Server is running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
