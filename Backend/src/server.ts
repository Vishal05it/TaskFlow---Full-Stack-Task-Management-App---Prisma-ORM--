import app from "./app.js";
import { connectToDB } from "./config/connectToDB.js";
import { authRouter } from "./routes/auth.routes.js";
import { taskRouter } from "./routes/task.routes.js";
import cors from "cors";
// import { mediaRouter } from "./routes/media.routes.js";
console.log("Frontend URL : ", process.env.FRONTEND_URL);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  }),
);
const PORT = process.env.PORT || 7000;
const startServer = async () => {
  await connectToDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
startServer();
// ---- Routes logic here -----
app.use("/api/v1.1/auth", authRouter);
app.use("/api/v1.1/task", taskRouter);
// app.use("/media", mediaRouter);
