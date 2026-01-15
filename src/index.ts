import express from 'express';
import cors from 'cors';

import subjectRouter from "./routes/subjects";

const app = express();
const port = 8000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

app.use(express.json());

app.use("/api/v1/subjects",subjectRouter);

app.get('/', (_, res) => {
  res.json({ message: 'Hello from Classroom Backend!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
