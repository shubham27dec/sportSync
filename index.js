const express = require("express");
const connectDB = require("./DB/db");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
connectDB();

const studentRouter = require("./routes/student");
const eventRouter = require("./routes/event");

const notificationScheduler = require("./schedular/notificationScheduler");

app.use("/student-coach", studentRouter);
app.use("/event", eventRouter);

notificationScheduler();

app.get("/", (req, res) => {
  res.status(200).json("helo from root ");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
